import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import MagicString from 'magic-string'
import type { Plugin } from 'vite'
import { createLucideIconSources } from './icons'

export function lucideUniapp(): Plugin {
  let root = ''
  let cacheDirectory = ''
  let enabled = false
  let license: string | undefined
  let compiler: typeof import('@vue/compiler-sfc')
  const components = new Map<string, Promise<string>>()

  function component(name: string) {
    let pending = components.get(name)
    if (!pending) {
      pending = (async () => {
        const sources = await createLucideIconSources(root, [name])
        license = sources['LUCIDE-LICENSE']
        await mkdir(cacheDirectory, { recursive: true })
        const file = join(
          cacheDirectory,
          `${name}-${createHash('sha256').update(name).digest('hex').slice(0, 8)}.vue`,
        )
        for (const [path, content] of [
          [file, sources[`${name}.vue`]!],
          [join(cacheDirectory, 'LUCIDE-LICENSE'), sources['LUCIDE-LICENSE']!],
        ] as const) {
          let previous: string | undefined
          try {
            previous = await readFile(path, 'utf8')
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
          }
          if (previous !== content) await writeFile(path, content)
        }
        return file
      })()
      components.set(name, pending)
    }
    return pending
  }

  return {
    name: 'vite-plugin-lucide-uniapp',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
      cacheDirectory = join(resolve(root, process.env.UNI_INPUT_DIR || 'src'), 'shadcn-lucide')
      enabled = Boolean(process.env.UNI_PLATFORM?.startsWith('mp-'))
      // Use the project's Vue compiler; uni-app aliases Vue internals to its own version.
      if (enabled) compiler = createRequire(join(root, 'package.json'))('vue/compiler-sfc')
    },
    buildStart() {
      components.clear()
      license = undefined
    },
    generateBundle() {
      if (enabled && license)
        this.emitFile({ type: 'asset', fileName: 'LUCIDE-LICENSE', source: license })
    },
    async transform(source, id) {
      if (
        !enabled ||
        !source.includes('@lucide/vue') ||
        id.includes('/node_modules/') ||
        id.includes('/shadcn-lucide/')
      )
        return
      const file = id.split('?')[0]!
      const { parse: parseSfc, babelParse } = compiler
      const isVue = file.endsWith('.vue') && !id.includes('?')
      if (!isVue && !/\.[cm]?[jt]sx?$/.test(file)) return
      const blocks = isVue
        ? (() => {
            const { descriptor, errors } = parseSfc(source, { filename: file })
            if (errors.length) throw errors[0]
            return [descriptor.script, descriptor.scriptSetup]
              .filter((block) => block != null)
              .map((block) => ({
                content: block.content,
                offset: block.loc.start.offset,
                jsx: block.lang === 'tsx' || block.lang === 'jsx',
              }))
          })()
        : [{ content: source, offset: 0, jsx: /\.[jt]sx$/.test(file) }]
      const output = new MagicString(source)
      for (const block of blocks) {
        const parsed = babelParse(block.content, {
          sourceType: 'module',
          plugins: block.jsx ? ['typescript', 'jsx'] : ['typescript'],
        })
        for (const statement of parsed.program.body) {
          if (
            statement.type !== 'ImportDeclaration' ||
            statement.source.value !== '@lucide/vue' ||
            statement.importKind === 'type'
          )
            continue
          const runtime = statement.specifiers.filter(
            (specifier) => specifier.type !== 'ImportSpecifier' || specifier.importKind !== 'type',
          )
          if (!runtime.length) continue
          const imports: string[] = []
          for (const specifier of runtime) {
            if (specifier.type !== 'ImportSpecifier' || specifier.imported.type !== 'Identifier')
              throw new Error(
                'lucideUniapp: use named icon imports, for example import { Search } from "@lucide/vue". Namespace and default imports cannot be adapted to miniapps.',
              )
            const target = await component(specifier.imported.name)
            let path = relative(dirname(file), target).replaceAll('\\', '/')
            if (!path.startsWith('./') && !path.startsWith('../')) path = `./${path}`
            imports.push(`import ${specifier.local.name} from ${JSON.stringify(path)};`)
          }
          const types = statement.specifiers.filter(
            (specifier) => specifier.type === 'ImportSpecifier' && specifier.importKind === 'type',
          )
          if (types.length)
            imports.push(
              `import { ${types.map((specifier) => block.content.slice(specifier.start!, specifier.end!)).join(', ')} } from '@lucide/vue';`,
            )
          output.overwrite(
            block.offset + statement.start!,
            block.offset + statement.end!,
            imports.join('\n'),
          )
        }
      }
      if (!output.hasChanged()) return
      return {
        code: output.toString(),
        map: output.generateMap({ source: id, includeContent: true, hires: true }),
      }
    },
  }
}

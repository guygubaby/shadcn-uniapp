import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'node:fs'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import { blocks } from './blocks'
import { createPreset, generateThemeCss, parseTheme, presetNames } from './theme'
import type { PresetName, ThemeConfig } from './theme'

const projectSchema = z.strictObject({
  version: z.literal(1),
  theme: z.string().min(1),
  css: z.string().min(1),
  blocks: z.string().min(1),
})
export const defaultProjectConfig = {
  version: 1 as const,
  theme: 'src/theme/shadcn.theme.json',
  css: 'src/theme/shadcn.scss',
  blocks: 'src/components/blocks',
}
const configFile = 'shadcn-uniapp.json'

export function checkedPath(root: string, name: string): string {
  const full = resolve(root, name)
  const rel = relative(root, full)
  if (isAbsolute(name) || !rel || rel === '..' || rel.startsWith(`..${sep}`)) {
    throw new Error(`Path must stay inside the project: ${name}`)
  }
  let cursor = full
  while (cursor !== root) {
    if (lstatSync(cursor, { throwIfNoEntry: false })?.isSymbolicLink()) {
      throw new Error(`Refusing to write through a symlink: ${name}`)
    }
    cursor = dirname(cursor)
  }
  return full
}

export function writeFiles(
  root: string,
  files: Record<string, string>,
  force = false,
  allowed = new Set<string>(),
) {
  const targets = Object.entries(files).map(([name, content]) => ({
    name,
    content,
    full: checkedPath(root, name),
  }))
  for (const file of targets) {
    if (existsSync(file.full) && !force && !allowed.has(file.name)) {
      throw new Error(
        `${file.name} already exists. No files were changed. Use --force only if you want to replace it.`,
      )
    }
    if (existsSync(file.full) && !lstatSync(file.full).isFile())
      throw new Error(`Not a file: ${file.name}`)
  }
  for (const file of targets) {
    mkdirSync(dirname(file.full), { recursive: true })
    writeFileSync(file.full, file.content, { flag: force || allowed.has(file.name) ? 'w' : 'wx' })
  }
  return targets.map((file) => file.name)
}

export function projectRoot(cwd: string) {
  return realpathSync(resolve(cwd))
}

function readConfig(root: string) {
  const config = projectSchema.parse(
    JSON.parse(readFileSync(checkedPath(root, configFile), 'utf8')),
  )
  for (const path of [config.theme, config.css, config.blocks]) checkedPath(root, path)
  if (new Set([configFile, config.theme, config.css, config.blocks]).size !== 4) {
    throw new Error('Theme, CSS and blocks paths must be distinct.')
  }
  if (!/\.s?css$/.test(config.css) || !config.theme.endsWith('.json')) {
    throw new Error('Theme must be a JSON file and CSS must be a .css or .scss file.')
  }
  return config
}

function requireWot2(root: string) {
  const pkg = JSON.parse(readFileSync(checkedPath(root, 'package.json'), 'utf8')) as {
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
  }
  const version = pkg.dependencies?.['@wot-ui/ui'] ?? pkg.devDependencies?.['@wot-ui/ui']
  if (!version || !/^[~^=]?2\./.test(version)) {
    throw new Error(
      'This release supports npm-installed @wot-ui/ui 2.x only. Keep your existing Wot major version; Wot v1 is not supported.',
    )
  }
}

export function initProject(cwd: string, preset: PresetName | ThemeConfig = 'zinc', force = false) {
  const root = projectRoot(cwd)
  requireWot2(root)
  if (typeof preset === 'string' && !(presetNames as readonly string[]).includes(preset))
    throw new Error(`Unknown preset: ${preset}`)
  const appPath = existsSync(resolve(root, 'src/App.vue')) ? 'src/App.vue' : 'App.vue'
  const app = readFileSync(checkedPath(root, appPath), 'utf8')
  const config =
    appPath === 'App.vue'
      ? {
          ...defaultProjectConfig,
          theme: 'theme/shadcn.theme.json',
          css: 'theme/shadcn.scss',
          blocks: 'components/blocks',
        }
      : defaultProjectConfig
  const theme = typeof preset === 'string' ? createPreset(preset) : parseTheme(preset)
  const importPath = `./${relative(dirname(resolve(root, appPath)), resolve(root, config.css))
    .split(sep)
    .join('/')}`
  const wotImport = app.includes('@wot-ui/ui/styles/theme/index.scss')
    ? ''
    : "@use '@wot-ui/ui/styles/theme/index.scss' as *;\n"
  const nextApp = app.includes(importPath)
    ? app
    : `${app.trimEnd()}\n\n<style lang="scss">\n${wotImport}@use '${importPath}' as *;\n</style>\n`
  return writeFiles(
    root,
    {
      [configFile]: JSON.stringify(config, null, 2) + '\n',
      [config.theme]: JSON.stringify(theme, null, 2) + '\n',
      [config.css]: generateThemeCss(theme),
      'scripts/lucide-icons.mjs': `import { generateLucideIcons } from 'shadcn-uniapp/icons'
import { fileURLToPath } from 'node:url'

try {
  const files = await generateLucideIcons(fileURLToPath(new URL('../', import.meta.url)), process.argv.slice(2))
  console.log(files.join('\\n'))
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
`,
      [appPath]: nextApp,
    },
    force,
    new Set([appPath]),
  )
}

export function generateProjectTheme(cwd: string) {
  const root = projectRoot(cwd)
  const config = readConfig(root)
  const themeFile = checkedPath(root, config.theme)
  if (lstatSync(themeFile).size > 256 * 1024)
    throw new Error('Theme JSON must be smaller than 256 KiB.')
  const theme = parseTheme(JSON.parse(readFileSync(themeFile, 'utf8')))
  return writeFiles(root, { [config.css]: generateThemeCss(theme) }, true)
}

export function addBlock(cwd: string, name: string, force = false) {
  const root = projectRoot(cwd)
  requireWot2(root)
  const config = readConfig(root)
  const block = blocks.find((item) => item.name === name)
  if (!block)
    throw new Error(
      `Unknown block: ${name}. Available: ${blocks.map((item) => item.name).join(', ')}`,
    )
  const files = Object.fromEntries(
    block.files.map((file) => [
      `${config.blocks}/${block.name}/${file}`,
      readFileSync(
        fileURLToPath(new URL(`../registry/${block.name}/${file}`, import.meta.url)),
        'utf8',
      ),
    ]),
  )
  return writeFiles(root, files, force)
}

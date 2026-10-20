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
import { generateThemeCss, parseTheme } from './theme'
import type { ThemeConfig } from './theme'
import { decodeThemePreset } from './preset'
import { uiStyleGuide } from './style-guide'
import { addThemeStyles } from './app-styles'

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
const guideFile = 'UI_STYLE_GUIDE.md'
const agentRulesFile = 'AGENTS.md'

function checkedPath(root: string, name: string): string {
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

function writeFiles(
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

function projectRoot(cwd: string) {
  return realpathSync(resolve(cwd))
}

function guidanceFiles(root: string): Record<string, string> {
  const files: Record<string, string> = {}
  const guidePath = checkedPath(root, guideFile)
  if (!existsSync(guidePath)) files[guideFile] = uiStyleGuide
  else if (!lstatSync(guidePath).isFile()) throw new Error(`Not a file: ${guideFile}`)
  const rulesPath = checkedPath(root, agentRulesFile)
  const currentRules = existsSync(rulesPath) ? readFileSync(rulesPath, 'utf8') : ''
  if (!currentRules.includes(guideFile)) {
    const reference = `## UI style guide\n\nBefore creating or changing UI, read and follow [${guideFile}](./${guideFile}). Reuse the installed theme and shared components.\n`
    files[agentRulesFile] = currentRules ? `${currentRules}\n\n${reference}` : reference
  }
  return files
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

function appThemeFile(root: string, css: string) {
  const appPath = existsSync(resolve(root, 'src/App.vue')) ? 'src/App.vue' : 'App.vue'
  const source = readFileSync(checkedPath(root, appPath), 'utf8')
  const importPath = `./${relative(dirname(resolve(root, appPath)), resolve(root, css))
    .split(sep)
    .join('/')}`
  return { appPath, source, content: addThemeStyles(source, appPath, importPath) }
}

export function initProject(cwd: string, preset: string | ThemeConfig = 'zinc', force = false) {
  const root = projectRoot(cwd)
  requireWot2(root)
  const appPath = existsSync(resolve(root, 'src/App.vue')) ? 'src/App.vue' : 'App.vue'
  const config =
    appPath === 'App.vue'
      ? {
          ...defaultProjectConfig,
          theme: 'theme/shadcn.theme.json',
          css: 'theme/shadcn.scss',
          blocks: 'components/blocks',
        }
      : defaultProjectConfig
  const theme = typeof preset === 'string' ? decodeThemePreset(preset) : parseTheme(preset)
  const { content: nextApp } = appThemeFile(root, config.css)
  return writeFiles(
    root,
    {
      [configFile]: JSON.stringify(config, null, 2) + '\n',
      [config.theme]: JSON.stringify(theme, null, 2) + '\n',
      [config.css]: generateThemeCss(theme),
      [appPath]: nextApp,
      ...guidanceFiles(root),
    },
    force,
    new Set([appPath, agentRulesFile]),
  )
}

export function generateProjectTheme(cwd: string) {
  const root = projectRoot(cwd)
  const config = readConfig(root)
  const themeFile = checkedPath(root, config.theme)
  if (lstatSync(themeFile).size > 256 * 1024)
    throw new Error('Theme JSON must be smaller than 256 KiB.')
  const theme = parseTheme(JSON.parse(readFileSync(themeFile, 'utf8')))
  const app = appThemeFile(root, config.css)
  return writeFiles(
    root,
    {
      [config.css]: generateThemeCss(theme),
      ...(app.source === app.content ? {} : { [app.appPath]: app.content }),
      ...guidanceFiles(root),
    },
    true,
  )
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

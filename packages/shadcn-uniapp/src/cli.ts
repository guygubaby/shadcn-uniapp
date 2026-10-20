#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { addBlock, generateProjectTheme, initProject } from './project'
import { blocks } from './blocks'
import { parseTheme, presetNames } from './theme'

const help = `shadcn-uniapp 0.1.4 — Wot UI 2.x themes and source blocks

  shadcn-uniapp init [--preset ${presetNames.join('|')}]
  shadcn-uniapp init --preset <code-from-creator>
  shadcn-uniapp init --theme ./shadcn.theme.json
  shadcn-uniapp generate
  shadcn-uniapp add <block>

Blocks: ${blocks.map((block) => block.name).join(', ')}

Options:
  --cwd <directory>  Use a different project directory
  --preset <code>    Apply a Creator preset code or a built-in preset name
  --theme <file>     Initialize from exported Creator JSON (relative to --cwd)
  --force            Explicitly replace existing generated files
  --help             Show this message

init adds a global theme import, UI_STYLE_GUIDE.md and an AGENTS.md reference.
Install icons for your app: pnpm add @lucide/vue
New miniapps: Tailwind CSS v4 + weapp-tailwindcss (uni-app Vite integration).
generate refreshes CSS and adds missing guidance; existing guides and agent rules are preserved.
No dependency is installed, no Wot source is patched, and Wot v1 is not supported.
`

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      cwd: { type: 'string', default: process.cwd() },
      preset: { type: 'string' },
      theme: { type: 'string' },
      force: { type: 'boolean', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  })
  const [command, name, ...extra] = positionals
  if (values.help || !command) {
    process.stdout.write(help)
  } else {
    if (extra.length || (command !== 'add' && name))
      throw new Error('Unexpected arguments. Run with --help.')
    let files: string[]
    if (command === 'init') {
      if (values.theme && values.preset)
        throw new Error('Use either --preset or --theme, not both.')
      if (values.theme) {
        const file = resolve(values.cwd, values.theme)
        if (statSync(file).size > 256 * 1024)
          throw new Error('Theme JSON must be smaller than 256 KiB.')
        files = initProject(
          values.cwd,
          parseTheme(JSON.parse(readFileSync(file, 'utf8'))),
          values.force,
        )
      } else {
        files = initProject(values.cwd, values.preset ?? 'zinc', values.force)
      }
    } else if (command === 'generate') {
      files = generateProjectTheme(values.cwd)
    } else if (command === 'add' && name) {
      files = addBlock(values.cwd, name, values.force)
    } else {
      throw new Error('Unknown command or missing block name. Run with --help.')
    }
    process.stdout.write(`Done:\n${files.map((file) => `  ${file}`).join('\n')}\n`)
    if (command === 'init')
      process.stdout.write(
        'UI_STYLE_GUIDE.md is linked from AGENTS.md for future UI work. Existing guidance is preserved.\nKeep Wot easycom as configured. Sass is required.\nInstall icons: pnpm add @lucide/vue\nRegister lucideUniapp() from shadcn-uniapp/vite before uni() in vite.config.ts (Vite 5 supported).\nUse named imports from @lucide/vue normally; miniapp builds adapt them automatically. Theme styles contain no icon assets.\nNew miniapps: Tailwind CSS v4 + weapp-tailwindcss.\nEdit the theme JSON, then run shadcn-uniapp generate.\n',
      )
  }
} catch (error) {
  process.stderr.write(`shadcn-uniapp: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
}

#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { addBlock, generateProjectTheme, initProject } from './project'
import { parseTheme, presetNames } from './theme'
import type { PresetName } from './theme'

const help = `shadcn-uniapp 0.1.0 — Wot UI 2.x themes and source blocks

  shadcn-uniapp init [--preset ${presetNames.join('|')}]
  shadcn-uniapp init --theme ./shadcn.theme.json
  shadcn-uniapp generate
  shadcn-uniapp add profile-card|settings-form|filter-list

Options:
  --cwd <directory>  Use a different project directory
  --theme <file>     Initialize from exported Creator JSON (relative to --cwd)
  --force            Explicitly replace existing generated files
  --help             Show this message

init preserves Wot APIs and adds a global theme import to App.vue.
generate reads shadcn-uniapp.json and regenerates only its CSS output.
No dependency is installed, no Wot source is patched, and Wot v1 is not supported.
`

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      cwd: { type: 'string', default: process.cwd() },
      preset: { type: 'string', default: 'zinc' },
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
      if (!(presetNames as readonly string[]).includes(values.preset))
        throw new Error(`Unknown preset: ${values.preset}`)
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
        files = initProject(values.cwd, values.preset as PresetName, values.force)
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
        'Keep Wot easycom as configured. Sass is required. Edit the theme JSON, then run shadcn-uniapp generate.\n',
      )
  }
} catch (error) {
  process.stderr.write(`shadcn-uniapp: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
}

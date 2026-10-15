import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, describe, expect, it } from 'vitest'
import { addBlock, generateProjectTheme, initProject } from '../packages/shadcn-uniapp/src/project'
import { blocks } from '../packages/shadcn-uniapp/src/blocks'
import { createPreset } from '../packages/shadcn-uniapp/src/theme'

const directories: string[] = []
function project() {
  const root = mkdtempSync(join(tmpdir(), 'shadcn-uniapp-test-'))
  directories.push(root)
  mkdirSync(join(root, 'src'))
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ dependencies: { '@wot-ui/ui': '^2.3.2' } }),
  )
  writeFileSync(
    join(root, 'src/App.vue'),
    '<script setup lang="ts">const keep = true</script>\n<style>.keep { color: red }</style>\n',
  )
  return root
}
afterEach(() => {
  for (const root of directories.splice(0)) rmSync(root, { recursive: true, force: true })
})

describe('safe source installation', () => {
  it('initializes from a validated Creator theme with typography', () => {
    const root = project()
    const theme = { ...createPreset('violet'), font: 'mono' as const, radius: 16 }
    initProject(root, theme)
    expect(JSON.parse(readFileSync(join(root, 'src/theme/shadcn.theme.json'), 'utf8'))).toEqual(
      theme,
    )
    expect(readFileSync(join(root, 'src/theme/shadcn.scss'), 'utf8')).toContain('JetBrains Mono')
  })
  it('initializes, generates, and installs each block without erasing project code', () => {
    const root = project()
    initProject(root)
    expect(readFileSync(join(root, 'src/App.vue'), 'utf8')).toContain('const keep = true')
    expect(readFileSync(join(root, 'src/App.vue'), 'utf8')).toContain('.keep { color: red }')
    generateProjectTheme(root)
    for (const block of blocks) {
      addBlock(root, block.name)
      for (const file of block.files)
        expect(existsSync(join(root, 'src/components/blocks', block.name, file))).toBe(true)
    }
    expect(
      readFileSync(join(root, 'src/components/blocks/profile-card/ProfileCard.vue'), 'utf8'),
    ).toContain('wd-cell-group')
    expect(() => addBlock(root, 'profile-card')).toThrow(/already exists/)
    expect(() => initProject(root)).toThrow(/already exists/)
    initProject(root, 'blue', true)
    expect(
      readFileSync(join(root, 'src/App.vue'), 'utf8').match(/@use '.\/theme\/shadcn.scss'/g),
    ).toHaveLength(1)
  })

  it('refuses Wot v1 without creating configuration', () => {
    const root = project()
    writeFileSync(
      join(root, 'package.json'),
      JSON.stringify({ dependencies: { 'wot-design-uni': '^1.14.0' } }),
    )
    expect(() => initProject(root)).toThrow(/Wot v1/)
    expect(existsSync(join(root, 'shadcn-uniapp.json'))).toBe(false)
  })

  it('preflights conflicts before changing App.vue or writing config', () => {
    const root = project()
    mkdirSync(join(root, 'src/theme'))
    writeFileSync(join(root, 'src/theme/shadcn.scss'), 'user owned')
    const app = readFileSync(join(root, 'src/App.vue'), 'utf8')
    expect(() => initProject(root)).toThrow(/already exists/)
    expect(existsSync(join(root, 'shadcn-uniapp.json'))).toBe(false)
    expect(readFileSync(join(root, 'src/App.vue'), 'utf8')).toBe(app)
    expect(readFileSync(join(root, 'src/theme/shadcn.scss'), 'utf8')).toBe('user owned')
  })

  it('rejects traversal and symlink output paths', () => {
    const root = project()
    initProject(root)
    const path = join(root, 'shadcn-uniapp.json')
    const config = JSON.parse(readFileSync(path, 'utf8'))
    writeFileSync(path, JSON.stringify({ ...config, css: '../escaped.scss' }))
    expect(() => generateProjectTheme(root)).toThrow(/inside/)
    writeFileSync(path, JSON.stringify({ ...config, blocks: 'linked' }))
    const other = mkdtempSync(join(tmpdir(), 'shadcn-uniapp-outside-'))
    directories.push(other)
    symlinkSync(other, join(root, 'linked'), 'dir')
    expect(() => addBlock(root, 'profile-card')).toThrow(/symlink/)
  })

  it('rejects malformed imports without overwriting the existing stylesheet', () => {
    const root = project()
    initProject(root)
    const css = readFileSync(join(root, 'src/theme/shadcn.scss'), 'utf8')
    writeFileSync(join(root, 'src/theme/shadcn.theme.json'), '{"version":2}')
    expect(() => generateProjectTheme(root)).toThrow()
    expect(readFileSync(join(root, 'src/theme/shadcn.scss'), 'utf8')).toBe(css)
    expect(() => addBlock(root, '../../evil')).toThrow(/Unknown block/)
  })
})

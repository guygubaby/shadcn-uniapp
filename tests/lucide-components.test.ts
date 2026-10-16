import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it } from 'vitest'
import { createLucideIconSources, generateLucideIcons } from '../packages/shadcn-uniapp/src/icons'

const directories: string[] = []
afterEach(() =>
  directories.splice(0).forEach((path) => rmSync(path, { recursive: true, force: true })),
)
function project() {
  const root = mkdtempSync(join(tmpdir(), 'lucide-uniapp-'))
  directories.push(root)
  mkdirSync(join(root, 'src'))
  writeFileSync(join(root, 'src/App.vue'), '<template><view /></template>')
  writeFileSync(join(root, 'package.json'), '{}')
  mkdirSync(join(root, 'node_modules/@lucide'), { recursive: true })
  symlinkSync(
    realpathSync('apps/preview/node_modules/@lucide/vue'),
    join(root, 'node_modules/@lucide/vue'),
    'dir',
  )
  return root
}

it('generates only requested icons, including official aliases, with separate H5 and MP rendering', async () => {
  const sources = await createLucideIconSources('apps/preview', ['Search', 'Search', 'Home'])
  expect(Object.keys(sources)).toEqual(['LUCIDE-LICENSE', 'Search.vue', 'Home.vue'])
  expect(sources['Search.vue']).toContain("import { Search as SourceIcon } from '@lucide/vue'")
  expect(sources['Home.vue']).toContain("import { Home as SourceIcon } from '@lucide/vue'")
  expect(sources['Search.vue']).toContain('// #ifdef MP\nconst svg =')
  expect(sources['Search.vue']).toContain('strokeWidth?: number')
  expect(sources['Search.vue']).toContain('backgroundColor: props.color')
  expect(sources['Search.vue']).not.toContain('wd-icon')
  expect(sources['Search.vue']).not.toContain('video-camera')
  await expect(createLucideIconSources('apps/preview', ['Search', '../bad'])).rejects.toThrow(
    'Unknown Lucide icon',
  )
})

it('adds icons incrementally, preflights conflicts, and refuses symlink output paths', async () => {
  const root = project()
  await generateLucideIcons(root, ['Search'])
  await generateLucideIcons(root, ['Home'])
  const output = join(root, 'src/components/lucide')
  writeFileSync(join(output, 'Search.vue'), 'user owned')
  await expect(generateLucideIcons(root, ['Camera', 'Search'])).rejects.toThrow('already exists')
  expect(existsSync(join(output, 'Camera.vue'))).toBe(false)
  expect(readFileSync(join(output, 'Search.vue'), 'utf8')).toBe('user owned')
  await generateLucideIcons(root, ['Search'], true)
  expect(readFileSync(join(output, 'Search.vue'), 'utf8')).toContain('SourceIcon')
  rmSync(output, { recursive: true })
  const other = project()
  symlinkSync(other, output, 'dir')
  await expect(generateLucideIcons(root, ['Search'])).rejects.toThrow('symlink')
})

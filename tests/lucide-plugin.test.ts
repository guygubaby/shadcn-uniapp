import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it, vi } from 'vitest'
import { lucideUniapp } from '../packages/shadcn-uniapp/src/vite'
import { createLucideIconSources } from '../packages/shadcn-uniapp/src/icons'

const directories: string[] = []
afterEach(() => {
  vi.unstubAllEnvs()
  directories.splice(0).forEach((path) => rmSync(path, { recursive: true, force: true }))
})
function fixture(platform = 'mp-weixin') {
  const root = mkdtempSync(join(tmpdir(), 'lucide-vite5-'))
  directories.push(root)
  mkdirSync(join(root, 'src'))
  writeFileSync(join(root, 'package.json'), '{}')
  mkdirSync(join(root, 'node_modules/@lucide'), { recursive: true })
  symlinkSync(
    realpathSync('apps/preview/node_modules/@lucide/vue'),
    join(root, 'node_modules/@lucide/vue'),
    'dir',
  )
  symlinkSync(realpathSync('apps/preview/node_modules/vue'), join(root, 'node_modules/vue'), 'dir')
  vi.stubEnv('UNI_PLATFORM', platform)
  vi.stubEnv('UNI_INPUT_DIR', join(root, 'src'))
  const plugin = lucideUniapp()
  ;(plugin.configResolved as (config: { root: string }) => void)({ root })
  return {
    root,
    plugin,
    transform: plugin.transform as (
      code: string,
      id: string,
    ) => Promise<{ code: string; map: unknown } | undefined>,
  }
}

it('rewrites named SFC imports, preserving aliases, type imports, templates and source maps', async () => {
  const { root, transform, plugin } = fixture()
  const source = `<script setup lang="ts">\nimport { Search as Lookup, type LucideProps, Home } from '@lucide/vue'\nconst label: string = 'search'\n</script>\n<template><Lookup :size="20" /><Home /></template>`
  const result = await transform(source, join(root, 'src/App.vue'))
  expect(result?.code).toMatch(/import Lookup from "\.\/shadcn-lucide\/Search-[\da-f]+\.vue"/)
  expect(result?.code).toContain("import { type LucideProps } from '@lucide/vue'")
  expect(result?.code).toContain('<template><Lookup :size="20" /><Home /></template>')
  expect(result?.map).toBeDefined()
  const files = readdirSync(join(root, 'src/shadcn-lucide'))
  expect(files).toHaveLength(3)
  const generated = readFileSync(
    join(
      root,
      'src/shadcn-lucide',
      files.find((name) => name.startsWith('Search-'))!,
    ),
    'utf8',
  )
  expect(generated).toContain('backgroundColor: props.color')
  expect(generated).toContain('strokeWidth?: number')
  expect(files.some((name) => name.startsWith('Camera'))).toBe(false)
  const assets: unknown[] = []
  if (typeof plugin.generateBundle !== 'function') throw new Error('Missing bundle hook')
  Reflect.apply(plugin.generateBundle, { emitFile: (asset: unknown) => assets.push(asset) }, [])
  expect(assets).toContainEqual(
    expect.objectContaining({
      fileName: 'LUCIDE-LICENSE',
      source: expect.stringContaining('ISC License'),
    }),
  )
})

it('handles JS modules and case-only aliases without collisions, including newly imported icons', async () => {
  const { root, transform } = fixture()
  await transform(
    `import { Axis3D, Axis3d } from '@lucide/vue'; export { Axis3D, Axis3d }`,
    join(root, 'src/icons.ts'),
  )
  await transform(
    `import { Camera } from '@lucide/vue'; const count = <number>1`,
    join(root, 'src/next.ts'),
  )
  const files = readdirSync(join(root, 'src/shadcn-lucide'))
  expect(files).toHaveLength(4)
  expect(new Set(files.map((name) => name.toLowerCase())).size).toBe(4)
})

it('leaves H5 imports unchanged and never patches application source files', async () => {
  const { root, transform } = fixture('h5')
  const source = `import { Search } from '@lucide/vue'`
  expect(await transform(source, join(root, 'src/icons.ts'))).toBeUndefined()
  expect(existsSync(join(root, 'src/shadcn-lucide'))).toBe(false)
})

it('ignores comments, type-only imports and dependencies; fails clearly for unsupported runtime imports', async () => {
  const { root, transform } = fixture()
  expect(
    await transform(`// import { Search } from '@lucide/vue'`, join(root, 'src/icons.ts')),
  ).toBeUndefined()
  expect(
    await transform(`import type { LucideProps } from '@lucide/vue'`, join(root, 'src/icons.ts')),
  ).toBeUndefined()
  expect(
    await transform(
      `import { Search } from '@lucide/vue'`,
      join(root, 'node_modules/example/index.ts'),
    ),
  ).toBeUndefined()
  await expect(
    transform(`import * as icons from '@lucide/vue'`, join(root, 'src/icons.ts')),
  ).rejects.toThrow('use named icon imports')
  await expect(
    transform(`import { MissingIcon } from '@lucide/vue'`, join(root, 'src/icons.ts')),
  ).rejects.toThrow('Unknown Lucide icon')
})

it('reads official icon names and aliases without pulling unrelated icon assets into a component', async () => {
  const sources = await createLucideIconSources('apps/preview', ['Search', 'Home'])
  expect(Object.keys(sources)).toEqual(['LUCIDE-LICENSE', 'Search.vue', 'Home.vue'])
  expect(sources['Search.vue']).not.toContain('Camera')
  expect(sources['Search.vue']).not.toContain('wd-icon')
  expect(sources['Home.vue']).toContain("import { Home as SourceIcon } from '@lucide/vue'")
})

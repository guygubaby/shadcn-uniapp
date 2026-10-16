import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const workspacePackage = join(root, 'packages/shadcn-uniapp')
const manifest = JSON.parse(await readFile(join(workspacePackage, 'package.json'), 'utf8'))
const tarball = join(root, 'artifacts', `${manifest.name}-${manifest.version}.tgz`)
const packageRequire = createRequire(join(workspacePackage, 'package.json'))
const viteRoot = dirname(packageRequire.resolve('vite/package.json'))
const { loadConfigFromFile, version } = await import(
  pathToFileURL(join(viteRoot, 'dist/node/index.js')).href
)
assert.match(version, /^5\./)
const fixture = await realpath(await mkdtemp(join(tmpdir(), 'shadcn-vite5-config-')))
const previousPlatform = process.env.UNI_PLATFORM
const previousInput = process.env.UNI_INPUT_DIR

try {
  const packageDirectory = join(fixture, 'node_modules/shadcn-uniapp')
  await mkdir(packageDirectory, { recursive: true })
  execFileSync('tar', ['-xzf', tarball, '--strip-components=1', '-C', packageDirectory])
  await writeFile(join(fixture, 'package.json'), JSON.stringify({ private: true }))
  await mkdir(join(fixture, 'src'))
  const consumerRequire = createRequire(join(fixture, 'package.json'))
  assert.equal(
    consumerRequire.resolve('shadcn-uniapp/vite'),
    join(packageDirectory, 'dist/vite.cjs'),
  )
  for (const file of ['vite.js', 'vite.cjs', 'vite.d.ts', 'vite.d.cts'])
    assert((await readFile(join(packageDirectory, 'dist', file), 'utf8')).length > 0)
  for (const name of Object.keys(manifest.dependencies)) {
    const destination = join(packageDirectory, 'node_modules', name)
    await mkdir(dirname(destination), { recursive: true })
    await symlink(join(workspacePackage, 'node_modules', name), destination, 'dir')
  }
  for (const name of ['vue', '@lucide/vue']) {
    const destination = join(fixture, 'node_modules', name)
    await mkdir(dirname(destination), { recursive: true })
    await symlink(join(root, 'apps/preview/node_modules', name), destination, 'dir')
  }

  process.env.UNI_PLATFORM = 'mp-weixin'
  process.env.UNI_INPUT_DIR = join(fixture, 'src')
  for (const extension of ['ts', 'mts']) {
    const configFile = join(fixture, `vite.config.${extension}`)
    await writeFile(
      configFile,
      `import { lucideUniapp } from 'shadcn-uniapp/vite'
export default { plugins: [lucideUniapp()] }
`,
    )
    const result = await loadConfigFromFile({ command: 'build', mode: 'test' }, configFile, fixture)
    const plugin = result?.config.plugins[0]
    assert.equal(plugin?.name, 'vite-plugin-lucide-uniapp')
    plugin.configResolved({ root: fixture })
    const transformed = await plugin.transform(
      `<script setup lang="ts">import { Search } from '@lucide/vue'</script><template><Search /></template>`,
      join(fixture, 'src/App.vue'),
    )
    assert.match(transformed.code, /shadcn-lucide\/Search-[\da-f]+\.vue/)
  }
  const names = await readdir(join(fixture, 'src/shadcn-lucide'))
  assert.equal(names.filter((name) => name.endsWith('.vue')).length, 1)
  console.log(
    `Packed plugin: Vite ${version} CJS (.ts) and ESM (.mts) static imports + miniapp transform passed`,
  )
} finally {
  if (previousPlatform === undefined) delete process.env.UNI_PLATFORM
  else process.env.UNI_PLATFORM = previousPlatform
  if (previousInput === undefined) delete process.env.UNI_INPUT_DIR
  else process.env.UNI_INPUT_DIR = previousInput
  await rm(fixture, { recursive: true, force: true })
}

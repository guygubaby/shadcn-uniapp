import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function sourceFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name)
    return entry.isDirectory() ? sourceFiles(path) : /\.(vue|ts)$/.test(path) ? [path] : []
  })
}

describe('component gallery coverage', () => {
  const preview = sourceFiles('apps/preview/src').filter((path) => !path.includes('/blocks/'))
  const blocks = sourceFiles('packages/shadcn-uniapp/registry')

  it('provides a source fixture for every wd-* component in the pinned Wot release', () => {
    const expected = readdirSync('apps/preview/node_modules/@wot-ui/ui/components').filter((name) =>
      name.startsWith('wd-'),
    )
    const source = [...preview, ...blocks].map((path) => readFileSync(path, 'utf8')).join('\n')
    const used = new Set([...source.matchAll(/<(wd-[a-z-]+)\b/g)].map((match) => match[1]))
    expect(expected.filter((name) => !used.has(name))).toEqual([])
    expect(expected).toHaveLength(100)
  })

  it('uses valid Wot v2 text statuses', () => {
    const source = [...preview, ...blocks].map((path) => readFileSync(path, 'utf8')).join('\n')
    for (const match of source.matchAll(/<wd-text\b[^>]*?\btype="([^"]+)"/g)) {
      expect(['primary', 'error', 'warning', 'success', 'default']).toContain(match[1])
    }
  })

  it('declares the default language in both applications', () => {
    for (const path of ['apps/site/index.html', 'apps/preview/index.html']) {
      expect(readFileSync(path, 'utf8')).toContain('lang="zh-CN"')
    }
  })

  it('contains sample watermarks instead of covering the full preview', () => {
    const source = preview.map((path) => readFileSync(path, 'utf8')).join('\n')
    const watermarks = [...source.matchAll(/<wd-watermark\b[^>]*>/g)]
    expect(watermarks).toHaveLength(1)
    expect(watermarks[0]![0]).toContain(':full-screen="false"')
    expect(watermarks[0]![0]).toContain('v-if="watermarkRef"')
    expect(source).toContain('const watermarkRef = ref(false)')
  })
})

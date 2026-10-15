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
  const preview = sourceFiles('apps/preview/src')
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

  it('keeps owned interface copy and document languages in English', () => {
    const paths = [
      ...preview,
      ...blocks,
      ...sourceFiles('apps/site/src'),
      'packages/shadcn-uniapp/src/blocks.ts',
      'packages/shadcn-uniapp/src/theme.ts',
    ]
    expect(paths.filter((path) => /\p{Script=Han}/u.test(readFileSync(path, 'utf8')))).toEqual([])
    for (const path of ['apps/site/index.html', 'apps/preview/index.html']) {
      expect(readFileSync(path, 'utf8')).toContain('lang="en"')
    }
  })
})

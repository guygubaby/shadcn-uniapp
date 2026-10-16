import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { lucideThemeCss } from '../packages/shadcn-uniapp/src/lucide-icons'
import { createPreset, generateThemeCss } from '../packages/shadcn-uniapp/src/theme'

it('covers every pinned Wot icon plus the search alias with exportable Lucide SVG masks', () => {
  const wot = readFileSync(
    'apps/preview/node_modules/@wot-ui/ui/components/wd-icon/iconfont.scss',
    'utf8',
  )
  const names = new Set([...wot.matchAll(/\.wd-icon-([\w-]+)/g)].map((match) => match[1]))
  names.add('search')
  for (const name of names) expect(lucideThemeCss, name).toContain(`.wd-icon-${name}::before`)
  expect(generateThemeCss(createPreset())).toContain(lucideThemeCss)
  const masks = [...lucideThemeCss.matchAll(/data:image\/svg\+xml,([^"\)]+)/g)]
  expect(masks.length).toBeGreaterThan(200)
  for (const [, encoded] of masks) {
    const svg = decodeURIComponent(encoded!)
    expect(svg).toContain('viewBox="0 0 24 24"')
    expect(svg).toContain('stroke-width="2"')
    expect(svg).not.toMatch(/<script|\bon\w+=|https?:\/\/(?!www.w3.org)/)
  }
})

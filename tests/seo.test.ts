import { expect, it } from 'vitest'
import {
  basePath,
  createSitemap,
  getPageSeo,
  getStructuredData,
  localizedPath,
  routeLocale,
  seoPaths,
  siteUrl,
} from '../apps/site/src/lib/seo'

it('gives every public page a unique title, canonical, and reciprocal language alternatives', () => {
  const titles = new Set<string>()
  for (const path of seoPaths) {
    for (const locale of ['en-US', 'zh-CN'] as const) {
      const localized = localizedPath(path, locale)
      const page = getPageSeo(localized)
      expect(page.locale).toBe(locale)
      expect(page.indexable).toBe(true)
      expect(page.description.length).toBeGreaterThan(60)
      expect(page.canonical).toBe(`${siteUrl}${localized}`)
      expect(page.alternates).toContainEqual({
        hreflang: locale === 'zh-CN' ? 'zh-CN' : 'en',
        href: page.canonical,
      })
      expect(titles.has(page.title)).toBe(false)
      titles.add(page.title)
      const other = getPageSeo(localizedPath(path, locale === 'zh-CN' ? 'en-US' : 'zh-CN'))
      expect(other.alternates).toEqual(page.alternates)
    }
  }
})

it('canonicalizes the legacy creator and rejects unknown pages without reflecting user input', () => {
  expect(getPageSeo('/creator').canonical).toBe(`${siteUrl}/create`)
  expect(getPageSeo('/en/creator').canonical).toBe(`${siteUrl}/create`)
  expect(getPageSeo('/zh/creator').canonical).toBe(`${siteUrl}/zh/create`)
  expect(getPageSeo('/<script>')).toMatchObject({ indexable: false, canonical: `${siteUrl}/404` })
  expect(getStructuredData('/missing')).toBeUndefined()
  expect(basePath('/en/docs/')).toBe('/docs')
  expect(basePath('/enjoy')).toBe('/enjoy')
  expect(basePath('/zh/docs/')).toBe('/docs')
  expect(routeLocale('/')).toBe('en-US')
  expect(routeLocale('/create')).toBe('en-US')
  expect(routeLocale('/zh/create')).toBe('zh-CN')
  expect(getPageSeo('/docs').alternates[2]).toEqual({
    hreflang: 'x-default',
    href: `${siteUrl}/docs`,
  })
})

it('lists only the eight canonical content URLs in the sitemap', () => {
  const sitemap = createSitemap()
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  expect(locations).toHaveLength(8)
  expect(new Set(locations).size).toBe(8)
  expect(sitemap).not.toMatch(/creator|preview\/|404|\?theme=|lastmod/)
  expect(sitemap.match(/hreflang="x-default"/g)).toHaveLength(8)
  expect(getStructuredData('/docs')?.['@graph'][2]).toMatchObject({
    '@type': 'WebPage',
    inLanguage: 'en-US',
    url: `${siteUrl}/docs`,
  })
})

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const output = new URL('../apps/site/dist/', import.meta.url)
const paths = ['/', '/create', '/blocks', '/docs', '/zh', '/zh/create', '/zh/blocks', '/zh/docs']
for (const path of paths) {
  const html = await readFile(
    new URL(path === '/' ? 'index.html' : `${path.slice(1)}.html`, output),
    'utf8',
  )
  assert.match(html, /<h1\b/, `${path} must contain its actual heading without JavaScript`)
  assert.match(html, /<main\b[\s\S]+?<\/main>/, `${path} must contain its page content`)
  assert.match(html, /<meta name="description" content="[^"]+"/)
  assert.match(html, /<meta property="og:image" content="https:\/\/[^\"]+\/og-image.png"/)
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, `${path} must have one canonical`)
  assert.ok(html.includes(`rel="canonical" href="https://shadcn-uniapp.guygubaby.top${path}"`))
  assert.match(html, path.startsWith('/zh') ? /<html lang="zh-CN"/ : /<html lang="en-US"/)
  assert.match(html, /hreflang="x-default"/)
  assert.doesNotMatch(html, /noindex|<div id="app"><!----><\/div>/)
  const structured = html.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  )
  assert.ok(structured, `${path} must contain structured data`)
  assert.equal(JSON.parse(structured[1])['@context'], 'https://schema.org')
}
const notFound = await readFile(new URL('404.html', output), 'utf8')
assert.match(notFound, /noindex/)
const redirects = await readFile(new URL('_redirects', output), 'utf8')
assert.doesNotMatch(redirects, /\/\*\s+\/index\.html\s+200/, 'Unknown pages must return real 404s')
const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8')
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 8)
const image = await readFile(new URL('og-image.png', output))
assert.equal(image.readUInt32BE(16), 1200)
assert.equal(image.readUInt32BE(20), 630)
console.log(
  'SEO verified: eight prerendered pages, localized metadata, schema, sitemap, social image, and 404.',
)

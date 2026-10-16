import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import type { ViteSSGOptions } from 'vite-ssg'
import { createSitemap, localizedPath, seoPaths } from './src/lib/seo'

const ssgOptions: ViteSSGOptions = {
  includedRoutes: () => [
    ...seoPaths.flatMap((path) => [path, localizedPath(path, 'en-US')]),
    '/404',
    '/en/404',
  ],
  formatting: 'minify',
  beastiesOptions: false,
}

export default defineConfig({
  ssgOptions,
  plugins: [
    VueRouter({ routesFolder: 'src/pages', dts: 'typed-router.d.ts' }),
    vue(),
    tailwindcss(),
    {
      name: 'site-sitemap',
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: createSitemap() })
      },
    },
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { host: '127.0.0.1' },
})

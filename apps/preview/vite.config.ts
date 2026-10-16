import { defineConfig } from 'vite'
import { createRequire } from 'node:module'
import { lucideUniapp } from 'shadcn-uniapp/vite'

const uni = createRequire(import.meta.url)('@dcloudio/vite-plugin-uni')
  .default as typeof import('@dcloudio/vite-plugin-uni').default

export default defineConfig({
  base: '/preview/',
  plugins: [lucideUniapp(), uni()],
  resolve: {
    dedupe: ['vue'],
  },
  css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
})

import { defineConfig } from 'vite'
import { createRequire } from 'node:module'
import { lucideUniapp } from 'shadcn-uniapp/vite'
import { fileURLToPath } from 'node:url'
import { WeappTailwindcss } from 'weapp-tailwindcss/vite'

const uni = createRequire(import.meta.url)('@dcloudio/vite-plugin-uni')
  .default as typeof import('@dcloudio/vite-plugin-uni').default

export default defineConfig({
  base: '/preview/',
  plugins: [
    lucideUniapp(),
    uni(),
    WeappTailwindcss({
      cssEntries: [fileURLToPath(new URL('./src/app.css', import.meta.url))],
      cssOptions: { rem2rpx: true },
    }),
  ],
  resolve: {
    dedupe: ['vue'],
  },
  css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
})

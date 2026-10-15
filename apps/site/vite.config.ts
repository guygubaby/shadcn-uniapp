import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import VueRouter from 'unplugin-vue-router/vite'

export default defineConfig({
  plugins: [
    VueRouter({ routesFolder: 'src/pages', dts: 'typed-router.d.ts' }),
    vue(),
    tailwindcss(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { host: '127.0.0.1' },
})

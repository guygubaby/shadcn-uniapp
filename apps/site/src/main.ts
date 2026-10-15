import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import '@fontsource-variable/manrope'
import '@fontsource-variable/jetbrains-mono'
import './style.css'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
router.afterEach((to) => {
  const titles: Record<string, string> = {
    '/': 'New theme. Same components.',
    '/creator': 'Theme Creator',
    '/create': 'Create your theme',
    '/blocks': 'Source-owned blocks',
    '/docs': 'Getting started',
  }
  document.title = `${titles[to.path] ?? 'Page not found'} — shadcn-uniapp`
})
createApp(App).use(createPinia()).use(VueQueryPlugin).use(router).mount('#app')

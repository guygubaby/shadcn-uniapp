import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import type { RouteRecordRaw } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import '@fontsource-variable/manrope'
import '@fontsource-variable/jetbrains-mono'
import './style.css'
import App from './App.vue'
import { localizedPath } from './lib/seo'

const localizedRoutes: RouteRecordRaw[] = routes.flatMap((route) =>
  (['en-US', 'zh-CN'] as const).map((locale): RouteRecordRaw => {
    const path = localizedPath(route.path, locale)
    if (route.path === '/creator')
      return {
        path,
        redirect: (to) => ({
          path: localizedPath('/create', locale),
          query: to.query,
          hash: to.hash,
        }),
      }
    return { ...route, path, name: `${String(route.name)}-${locale}` }
  }),
)
localizedRoutes.push(
  ...routes.map((route): RouteRecordRaw => ({
    path: `/en${route.path === '/' ? '' : route.path}`,
    redirect: (to) => ({
      path: localizedPath(route.path === '/creator' ? '/create' : route.path, 'en-US'),
      query: to.query,
      hash: to.hash,
    }),
  })),
)

export const createApp = ViteSSG(
  App,
  {
    routes: localizedRoutes,
    scrollBehavior: () => ({ top: 0, behavior: 'instant' }),
  },
  ({ app, isClient }) => {
    app.use(createPinia()).use(VueQueryPlugin)
    if (!isClient)
      app.config.errorHandler = (error) => {
        throw error
      }
  },
)

import { createSSRApp } from 'vue'
import App from './App.vue'
import { Locale } from '@wot-ui/ui'
import zhCN from '@wot-ui/ui/locale/lang/zh-CN'
// #ifdef H5
import '@fontsource-variable/manrope'
import '@fontsource-variable/jetbrains-mono'
// #endif

Locale.use('zh-CN', zhCN)

export function createApp() {
  return { app: createSSRApp(App) }
}

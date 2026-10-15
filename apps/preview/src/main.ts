import { createSSRApp } from 'vue'
import App from './App.vue'
import { Locale } from '@wot-ui/ui'
import enUS from '@wot-ui/ui/locale/lang/en-US'
// #ifdef H5
import '@fontsource-variable/manrope'
import '@fontsource-variable/jetbrains-mono'
// #endif

Locale.use('en-US', enUS)

export function createApp() {
  return { app: createSSRApp(App) }
}

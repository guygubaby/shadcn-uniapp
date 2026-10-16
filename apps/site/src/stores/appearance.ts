import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ThemeMode, UiLocale } from 'shadcn-uniapp'

export const useAppearanceStore = defineStore('appearance', () => {
  const modeRef = ref<ThemeMode>('light')
  const localeRef = ref<UiLocale>('zh-CN')
  return { modeRef, localeRef }
})

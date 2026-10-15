import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ThemeMode, UiLocale } from 'shadcn-uniapp'

export const useAppearanceStore = defineStore('appearance', () => {
  const modeRef = ref<ThemeMode>('light')
  const localeRef = ref<UiLocale>('zh-CN')
  try {
    if (localStorage.getItem('shadcn-uniapp:locale') === 'en-US') localeRef.value = 'en-US'
  } catch {
    /* Storage may be unavailable in private browsing. */
  }
  return { modeRef, localeRef }
})

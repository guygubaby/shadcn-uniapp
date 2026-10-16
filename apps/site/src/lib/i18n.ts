import { storeToRefs } from 'pinia'
import { translate } from 'shadcn-uniapp'
import { useAppearanceStore } from '@/stores/appearance'
import { localizedPath } from './seo'
export function useI18n() {
  const { localeRef } = storeToRefs(useAppearanceStore())
  return {
    localeRef,
    t: (text: unknown) => translate(text, localeRef.value),
    localePath: (path: string) => localizedPath(path, localeRef.value),
  }
}

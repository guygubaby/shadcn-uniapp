import { storeToRefs } from 'pinia'
import { translate } from 'shadcn-uniapp'
import { useAppearanceStore } from '@/stores/appearance'
export function useI18n() {
  const { localeRef } = storeToRefs(useAppearanceStore())
  return { localeRef, t: (text: unknown) => translate(text, localeRef.value) }
}

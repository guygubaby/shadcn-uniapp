import { inject } from 'vue'
export function usePreviewI18n() {
  const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) =>
    String(text ?? ''),
  )
  return { t }
}

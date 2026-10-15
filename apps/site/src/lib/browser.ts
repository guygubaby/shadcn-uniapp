import { toast } from 'vue-sonner'
import { translate } from 'shadcn-uniapp'
import { useAppearanceStore } from '@/stores/appearance'

export async function copyText(text: string) {
  const t = (text: string) => translate(text, useAppearanceStore().localeRef)
  try {
    await navigator.clipboard.writeText(text)
    toast.success(t('Copied to clipboard'))
  } catch {
    toast.error(t('Clipboard access is unavailable. Select and copy the text manually.'))
  }
}

export function downloadText(name: string, content: string, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

import type { ThemeMode } from 'shadcn-uniapp'

export function waitForPreviewTheme(mode: ThemeMode): Promise<void> {
  const source = document.querySelector<HTMLIFrameElement>(
    'iframe[src^="/preview/"]',
  )?.contentWindow
  if (!source) return Promise.resolve()
  return new Promise((resolve) => {
    function finish() {
      clearTimeout(timer)
      window.removeEventListener('message', receive)
      resolve()
    }
    function receive(event: MessageEvent) {
      if (
        event.origin === window.location.origin &&
        event.source === source &&
        event.data?.type === 'shadcn-uniapp:theme-applied' &&
        event.data.mode === mode
      )
        finish()
    }
    const timer = setTimeout(finish, 180)
    window.addEventListener('message', receive)
  })
}

import { afterEach, expect, it, vi } from 'vitest'
import { waitForPreviewTheme } from '../apps/site/src/lib/preview-theme'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

function setup() {
  vi.useFakeTimers()
  const source = {}
  const events = Object.assign(new EventTarget(), { location: { origin: 'https://preview.test' } })
  vi.stubGlobal('window', events)
  vi.stubGlobal('document', { querySelector: () => ({ contentWindow: source }) })
  function acknowledge(origin: string, frame: unknown, mode = 'dark') {
    events.dispatchEvent(
      Object.assign(new Event('message'), {
        origin,
        source: frame,
        data: { type: 'shadcn-uniapp:theme-applied', mode },
      }),
    )
  }
  return { source, events, acknowledge }
}

it('waits for the requested mode from the same-origin preview and removes its listener', async () => {
  const { source, events, acknowledge } = setup()
  const remove = vi.spyOn(events, 'removeEventListener')
  let done = false
  const pending = waitForPreviewTheme('dark').then(() => {
    done = true
  })
  acknowledge('https://foreign.test', source)
  acknowledge('https://preview.test', {})
  acknowledge('https://preview.test', source, 'light')
  await Promise.resolve()
  expect(done).toBe(false)
  acknowledge('https://preview.test', source)
  await pending
  expect(done).toBe(true)
  expect(remove).toHaveBeenCalledOnce()
  expect(vi.getTimerCount()).toBe(0)
})

it('releases the transition if a preview is still loading or cannot reply', async () => {
  const { events } = setup()
  const remove = vi.spyOn(events, 'removeEventListener')
  const pending = waitForPreviewTheme('light')
  await vi.advanceTimersByTimeAsync(180)
  await pending
  expect(remove).toHaveBeenCalledOnce()
})

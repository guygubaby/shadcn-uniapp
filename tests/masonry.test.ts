import { afterEach, expect, it, vi } from 'vitest'
import { enableMasonry } from '../apps/preview/src/lib/masonry'

afterEach(() => vi.unstubAllGlobals())

it('updates card spans without measuring overlay hosts or reordering cards, and disconnects on unmount', () => {
  let resize: () => void = () => {}
  const observe = vi.fn()
  const disconnect = vi.fn()
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resize = callback
      }
      observe = observe
      disconnect = disconnect
    },
  )
  vi.stubGlobal('getComputedStyle', () => ({ marginBottom: '24px' }))
  let height = 100
  const cards = [
    {
      matches: (selector: string) => selector === '.gallery-card',
      style: { gridRowEnd: '' },
      getBoundingClientRect: () => ({ height }),
    },
    {
      matches: (selector: string) => selector === '.gallery-card',
      style: { gridRowEnd: '' },
      getBoundingClientRect: () => ({ height: 200 }),
    },
  ]
  const overlay = { matches: () => false, getBoundingClientRect: vi.fn() }
  const children = [...cards, overlay]
  const root = { style: { gridAutoRows: '' }, children }
  const stop = enableMasonry(root as unknown as HTMLElement)
  expect(cards.map((card) => card.style.gridRowEnd)).toEqual(['span 16', 'span 28'])
  expect(observe.mock.calls.map(([card]) => card)).toEqual(cards)
  height = 144
  resize()
  expect(cards.map((card) => card.style.gridRowEnd)).toEqual(['span 21', 'span 28'])
  expect(root.children).toBe(children)
  expect(overlay.getBoundingClientRect).not.toHaveBeenCalled()
  stop()
  expect(disconnect).toHaveBeenCalledOnce()

  vi.stubGlobal('ResizeObserver', undefined)
  const fallback = { style: { gridAutoRows: '' }, children: cards }
  enableMasonry(fallback as unknown as HTMLElement)()
  expect(fallback.style.gridAutoRows).toBe('')
})

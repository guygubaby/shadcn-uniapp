import { afterEach, expect, it, vi } from 'vitest'
import { enableMasonry } from '../apps/preview/src/lib/masonry'

afterEach(() => vi.unstubAllGlobals())

it('updates natural card spans after resizing without reordering cards, and disconnects on unmount', () => {
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
    { style: { gridRowEnd: '' }, getBoundingClientRect: () => ({ height }) },
    { style: { gridRowEnd: '' }, getBoundingClientRect: () => ({ height: 200 }) },
  ]
  const root = { style: { gridAutoRows: '' }, children: cards }
  const stop = enableMasonry(root as unknown as HTMLElement)
  expect(cards.map((card) => card.style.gridRowEnd)).toEqual(['span 16', 'span 28'])
  expect(observe.mock.calls.map(([card]) => card)).toEqual(cards)
  height = 144
  resize()
  expect(cards.map((card) => card.style.gridRowEnd)).toEqual(['span 21', 'span 28'])
  expect(root.children).toBe(cards)
  stop()
  expect(disconnect).toHaveBeenCalledOnce()

  vi.stubGlobal('ResizeObserver', undefined)
  const fallback = { style: { gridAutoRows: '' }, children: cards }
  enableMasonry(fallback as unknown as HTMLElement)()
  expect(fallback.style.gridAutoRows).toBe('')
})

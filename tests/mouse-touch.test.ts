import { expect, it, vi } from 'vitest'
import { enableMouseTouch } from '../apps/preview/src/lib/mouse-touch'

it('bridges mouse drags to touch controls without duplicating native touch input', () => {
  const document = new EventTarget()
  const control = new EventTarget()
  const capturePointer = vi.fn()
  Object.assign(control, {
    closest: vi.fn(() => control),
    setPointerCapture: capturePointer,
  })
  const received: { type: string; touches: { clientX: number; clientY: number }[] }[] = []
  for (const type of ['touchstart', 'touchmove', 'touchend']) {
    control.addEventListener(type, (event) =>
      received.push(event as unknown as (typeof received)[number]),
    )
  }
  const cleanup = enableMouseTouch(document as unknown as Document)
  function pointer(type: string, overrides: Record<string, unknown> = {}) {
    const event = Object.assign(new Event(type, { cancelable: true }), {
      pointerId: 1,
      pointerType: 'mouse',
      button: 0,
      clientX: 20,
      clientY: 30,
      pageX: 20,
      pageY: 130,
      ...overrides,
    })
    Object.defineProperty(event, 'target', { value: control })
    document.dispatchEvent(event)
  }

  pointer('pointerdown', { pointerType: 'touch' })
  pointer('pointerdown', { button: 2 })
  expect(received).toEqual([])

  pointer('pointerdown')
  expect(control.closest).toHaveBeenCalledWith(expect.stringContaining('.wd-slider__dot'))
  expect(capturePointer).toHaveBeenCalledWith(1)
  pointer('pointermove', { pointerId: 2 })
  pointer('pointermove', { clientX: 140, clientY: 45 })
  pointer('pointerup')
  expect(received.map((event) => event.type)).toEqual(['touchstart', 'touchmove', 'touchend'])
  expect(received[1]?.touches[0]).toMatchObject({ clientX: 140, clientY: 45 })
  expect(received[2]?.touches).toEqual([])

  pointer('pointerdown')
  pointer('pointercancel')
  pointer('pointermove')
  expect(received.map((event) => event.type).slice(3)).toEqual(['touchstart', 'touchend'])

  pointer('pointerdown')
  pointer('lostpointercapture')
  pointer('pointermove')
  expect(received.map((event) => event.type).slice(5)).toEqual(['touchstart', 'touchend'])

  cleanup()
  pointer('pointerdown')
  expect(received).toHaveLength(7)
})

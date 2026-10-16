// Wot's draggable H5 controls only listen for touch events.
export function enableMouseTouch(document: Document) {
  let target: HTMLElement | null = null
  let pointerId: number | undefined

  function sendTouch(type: string, event: PointerEvent) {
    if (!target) return
    const point = {
      identifier: event.pointerId,
      target,
      clientX: event.clientX,
      clientY: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
    }
    target.dispatchEvent(
      Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
        touches: type === 'touchend' ? [] : [point],
        changedTouches: [point],
      }),
    )
  }

  function start(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || target) return
    target = (event.target as Element).closest<HTMLElement>(
      '.wd-signature__content-canvas, .wd-slide-verify__button, .wd-slider__dot',
    )
    if (!target) return
    pointerId = event.pointerId
    target.setPointerCapture(pointerId)
    event.preventDefault()
    sendTouch('touchstart', event)
  }

  function move(event: PointerEvent) {
    if (event.pointerId === pointerId) sendTouch('touchmove', event)
  }

  function end(event: PointerEvent) {
    if (event.pointerId !== pointerId) return
    sendTouch('touchend', event)
    if (target?.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture(event.pointerId)
    target = null
    pointerId = undefined
  }

  document.addEventListener('pointerdown', start)
  document.addEventListener('pointermove', move)
  document.addEventListener('pointerup', end)
  document.addEventListener('pointercancel', end)
  document.addEventListener('lostpointercapture', end)

  return () => {
    if (pointerId !== undefined && target?.hasPointerCapture?.(pointerId))
      target.releasePointerCapture(pointerId)
    target = null
    pointerId = undefined
    document.removeEventListener('pointerdown', start)
    document.removeEventListener('pointermove', move)
    document.removeEventListener('pointerup', end)
    document.removeEventListener('pointercancel', end)
    document.removeEventListener('lostpointercapture', end)
  }
}

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { useReducedMotion } from 'motion-v'
import { useRoute } from 'vue-router'
const cursorRef = useTemplateRef<HTMLDivElement>('cursor')
const dotRef = useTemplateRef<HTMLDivElement>('dot')
const reducedRef = useReducedMotion()
const route = useRoute()
let frame = 0,
  x = 0,
  y = 0,
  targetX = 0,
  targetY = 0,
  previous = 0
let enabled = false
function hide() {
  enabled = false
  cancelAnimationFrame(frame)
  frame = 0
  if (cursorRef.value) cursorRef.value.style.opacity = '0'
}
function tick(time: number) {
  if (!enabled || !cursorRef.value) return
  const alpha = 1 - Math.exp(-16 * Math.min((time - previous) / 1000 || 1 / 60, 0.032))
  previous = time
  x += (targetX - x) * alpha
  y += (targetY - y) * alpha
  cursorRef.value.style.transform = `translate3d(${x}px,${y}px,0)`
  if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1) frame = requestAnimationFrame(tick)
  else frame = 0
}
function move(event: PointerEvent) {
  if (
    reducedRef.value ||
    event.pointerType !== 'mouse' ||
    ['/create', '/creator'].includes(route.path)
  ) {
    hide()
    return
  }
  const target = event.target as HTMLElement
  if (target.closest('iframe, dialog, [role="dialog"]')) {
    hide()
    return
  }
  targetX = event.clientX
  targetY = event.clientY
  if (!enabled) {
    enabled = true
    x = targetX
    y = targetY
    previous = performance.now()
    if (cursorRef.value) cursorRef.value.style.opacity = '1'
  }
  if (!frame) frame = requestAnimationFrame(tick)
  if (dotRef.value) dotRef.value.style.scale = target.closest('a, button, summary') ? '2.6' : '1'
}
function visibility() {
  if (document.hidden) hide()
}
watch([reducedRef, () => route.path], hide)
onMounted(() => {
  window.addEventListener('pointermove', move, { passive: true })
  document.addEventListener('pointerleave', hide)
  document.addEventListener('visibilitychange', visibility)
  window.addEventListener('blur', hide)
})
onUnmounted(() => {
  hide()
  window.removeEventListener('pointermove', move)
  document.removeEventListener('pointerleave', hide)
  document.removeEventListener('visibilitychange', visibility)
  window.removeEventListener('blur', hide)
})
</script>
<template>
  <div
    ref="cursor"
    aria-hidden="true"
    class="pointer-events-none fixed top-0 left-0 z-40 opacity-0 mix-blend-difference"
  >
    <div
      ref="dot"
      class="-mt-1.5 -ml-1.5 size-3 rounded-full bg-white transition-[scale] duration-300"
    />
  </div>
</template>

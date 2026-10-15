<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { useReducedMotion } from 'motion-v'
const svgRef = useTemplateRef<SVGSVGElement>('line')
const pathRef = useTemplateRef<SVGPathElement>('path')
const reducedRef = useReducedMotion()
let width = 0,
  x = 0,
  y = 0,
  velocity = 0,
  target = 0,
  previous = 0,
  frame = 0
let hovering = false
let observer: ResizeObserver | undefined
function draw() {
  pathRef.value?.setAttribute('d', `M 0 32 Q ${x || width / 2} ${32 + y} ${width} 32`)
}
function stop() {
  cancelAnimationFrame(frame)
  frame = 0
  y = 0
  velocity = 0
  draw()
}
function tick(time: number) {
  const dt = Math.min((time - previous) / 1000 || 1 / 60, 0.032)
  previous = time
  if (hovering) y += (target - y) * (1 - Math.exp(-14 * dt))
  else {
    velocity = (velocity - y * 160 * dt) * Math.exp(-6 * dt)
    y += velocity * dt
  }
  draw()
  if (hovering || Math.abs(y) > 0.1 || Math.abs(velocity) > 0.1) frame = requestAnimationFrame(tick)
  else stop()
}
function move(event: PointerEvent) {
  if (reducedRef.value || event.pointerType !== 'mouse' || !svgRef.value) return
  const rect = svgRef.value.getBoundingClientRect()
  x = event.clientX - rect.left
  target = Math.max(-28, Math.min(28, (event.clientY - rect.top - 32) * 1.5))
  hovering = true
  if (!frame) {
    previous = performance.now()
    frame = requestAnimationFrame(tick)
  }
}
function release() {
  hovering = false
  target = 0
}
watch(reducedRef, (reduced) => {
  if (reduced) stop()
})
onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    width = entry?.contentRect.width ?? 0
    x = width / 2
    draw()
  })
  if (svgRef.value) observer.observe(svgRef.value)
})
onUnmounted(() => {
  observer?.disconnect()
  stop()
})
</script>
<template>
  <svg
    ref="line"
    aria-hidden="true"
    class="h-16 w-full overflow-visible text-border"
    @pointermove="move"
    @pointerleave="release"
  >
    <path ref="path" fill="none" stroke="currentColor" stroke-width="1" />
  </svg>
</template>

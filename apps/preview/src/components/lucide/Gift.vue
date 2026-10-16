<!-- Generated from @lucide/vue. ISC license; see LUCIDE-LICENSE. -->
<script setup lang="ts">
// #ifndef MP
import { Gift as SourceIcon } from '@lucide/vue'
// #endif
// #ifdef MP
import { computed } from 'vue'
// #endif

defineOptions({ options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' } })
const props = withDefaults(defineProps<{ size?: number; color?: string; strokeWidth?: number; label?: string }>(), { size: 24, color: 'currentColor', strokeWidth: 2 })

// #ifdef MP
const svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"black\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 7v14\"/><path d=\"M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\"/><path d=\"M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5\"/><rect x=\"3\" y=\"7\" width=\"18\" height=\"4\" rx=\"1\"/></svg>"
const iconStyleRef = computed(() => {
  const stroke = Number.isFinite(props.strokeWidth) ? Math.max(0, props.strokeWidth) : 2
  const mask = 'url("data:image/svg+xml,' + encodeURIComponent(svg.replace('stroke-width="2"', 'stroke-width="' + stroke + '"')) + '") center / contain no-repeat'
  return {
    display: 'inline-block', flexShrink: 0, verticalAlign: 'middle',
    width: props.size + 'px', height: props.size + 'px', backgroundColor: props.color,
    mask, WebkitMask: mask,
  }
})
// #endif
</script>
<template>
  <!-- #ifndef MP -->
  <SourceIcon :size="size" :color="color" :stroke-width="strokeWidth" :aria-label="label" :aria-hidden="label ? undefined : true" />
  <!-- #endif -->
  <!-- #ifdef MP -->
  <view :aria-label="label" :aria-hidden="!label" :style="iconStyleRef" />
  <!-- #endif -->
</template>

<!-- Generated from @lucide/vue. ISC license; see LUCIDE-LICENSE. -->
<script setup lang="ts">
// #ifndef MP
import { Search as SourceIcon } from '@lucide/vue'
// #endif
// #ifdef MP
import { computed } from 'vue'
// #endif

defineOptions({ options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' } })
const props = withDefaults(defineProps<{ size?: number; color?: string; strokeWidth?: number; label?: string }>(), { size: 24, color: 'currentColor', strokeWidth: 2 })

// #ifdef MP
const svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"black\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m21 21-4.34-4.34\"/><circle cx=\"11\" cy=\"11\" r=\"8\"/></svg>"
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

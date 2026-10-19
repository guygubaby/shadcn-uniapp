<script setup lang="ts">
import { onMounted, onUnmounted, ref, type ComponentPublicInstance } from 'vue'
import { enableMasonry } from '../../lib/masonry'

const gridRef = ref<ComponentPublicInstance | null>(null)
// #ifdef H5
let stop: (() => void) | undefined
onMounted(() => {
  const root = gridRef.value?.$el as HTMLElement | undefined
  if (root) stop = enableMasonry(root)
})
onUnmounted(() => stop?.())
// #endif
</script>

<template>
  <view ref="gridRef" class="gallery-grid"><slot /></view>
</template>

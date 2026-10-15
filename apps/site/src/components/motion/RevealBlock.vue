<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { motion } from 'motion-v'
import { revealEase, useReveal } from '@/lib/motion'
withDefaults(defineProps<{ delay?: number; card?: boolean }>(), { delay: 0, card: false })
const scopeRef = useTemplateRef<HTMLDivElement>('scope')
const { shownRef, reducedRef } = useReveal(scopeRef)
</script>
<template>
  <div
    ref="scope"
    :data-motion-card="card || undefined"
    :class="
      card &&
      'scale-100 transition-[scale] duration-500 ease-out focus-within:scale-[0.99] hover:scale-[0.99] motion-reduce:scale-100 motion-reduce:transition-none'
    "
  >
    <motion.div
      class="h-full"
      :initial="false"
      :animate="{
        opacity: shownRef ? 1 : 0,
        y: shownRef ? 0 : 40,
        scale: card && !shownRef ? 0.97 : 1,
      }"
      :transition="{
        duration: reducedRef ? 0 : 1,
        delay: reducedRef ? 0 : delay,
        ease: revealEase,
      }"
      ><slot
    /></motion.div>
  </div>
</template>

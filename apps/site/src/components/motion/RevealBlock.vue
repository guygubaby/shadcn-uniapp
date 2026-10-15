<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { motion } from 'motion-v'
import { revealEase, useReveal } from '@/lib/motion'
withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })
const scopeRef = useTemplateRef<HTMLDivElement>('scope')
const { shownRef, reducedRef } = useReveal(scopeRef)
</script>
<template>
  <div ref="scope">
    <motion.div
      :initial="false"
      :animate="{ opacity: shownRef ? 1 : 0, y: shownRef ? 0 : 40 }"
      :transition="{
        duration: reducedRef ? 0 : 1,
        delay: reducedRef ? 0 : delay,
        ease: revealEase,
      }"
      ><slot
    /></motion.div>
  </div>
</template>

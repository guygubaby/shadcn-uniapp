<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { motion } from 'motion-v'
import { revealEase, useReveal } from '@/lib/motion'
import { splitRevealText } from '@/lib/motion-text'

const props = withDefaults(defineProps<{ text: string; delay?: number }>(), { delay: 0 })
const scopeRef = useTemplateRef<HTMLSpanElement>('scope')
const { shownRef, reducedRef } = useReveal(scopeRef)
const words = computed(() => splitRevealText(props.text))
</script>
<template>
  <span ref="scope">
    <span class="sr-only">{{ text }}</span>
    <span v-for="(word, index) in words" :key="index" aria-hidden="true">
      <span v-if="word.trim()" class="reveal-mask max-w-full"
        ><motion.span
          class="inline-block max-w-full"
          :initial="false"
          :animate="{ y: shownRef ? '0%' : '120%' }"
          :transition="{
            duration: reducedRef ? 0 : 1.3,
            delay: reducedRef ? 0 : delay + Math.min(index * 0.025, 0.4),
            ease: revealEase,
          }"
          >{{ word }}</motion.span
        ></span
      ><template v-else>{{ word }}</template>
    </span>
  </span>
</template>
<style scoped>
.reveal-mask {
  display: inline-block;
  overflow: clip;
  vertical-align: top;
  padding: 0.12em 0.03em;
  margin: -0.12em -0.03em;
}
</style>

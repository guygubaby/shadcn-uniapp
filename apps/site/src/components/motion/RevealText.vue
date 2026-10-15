<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { computed, useTemplateRef } from 'vue'
import { motion } from 'motion-v'
import { revealEase, useReveal } from '@/lib/motion'

const { t } = useI18n()
const props = withDefaults(defineProps<{ text: string; delay?: number }>(), { delay: 0 })
const scopeRef = useTemplateRef<HTMLSpanElement>('scope')
const { shownRef, reducedRef } = useReveal(scopeRef)
const words = computed(() => props.text.split(/\s+/))
</script>
<template>
  <span ref="scope">
    <span class="sr-only">{{ t(text) }}</span>
    <span v-for="(word, index) in words" :key="index" aria-hidden="true">
      <span class="reveal-mask"
        ><motion.span
          class="inline-block"
          :initial="false"
          :animate="{ y: shownRef ? '0%' : '120%' }"
          :transition="{
            duration: reducedRef ? 0 : 1.3,
            delay: reducedRef ? 0 : delay + index * 0.055,
            ease: revealEase,
          }"
          >{{ t(word) }}</motion.span
        ></span
      >{{ t(index < words.length - 1 ? ' ' : '') }}
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

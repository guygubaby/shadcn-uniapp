<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { motion, useReducedMotion } from 'motion-v'
import { Moon, Sun } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { useAppearanceStore } from '@/stores/appearance'
import { useI18n } from '@/lib/i18n'
import { waitForPreviewTheme } from '@/lib/preview-theme'

const { t } = useI18n()
const { modeRef } = storeToRefs(useAppearanceStore())
const reducedRef = useReducedMotion()
const changingRef = ref(false)
let transition: ViewTransition | undefined
let animation: Animation | undefined

function finish() {
  animation?.finish()
  transition?.skipTransition()
}
watch(reducedRef, (reduced) => {
  if (reduced) finish()
})
onUnmounted(finish)

async function toggle(event: MouseEvent) {
  if (changingRef.value) return
  const targetMode = modeRef.value === 'light' ? 'dark' : 'light'
  if (reducedRef.value || !document.startViewTransition || document.hidden) {
    modeRef.value = targetMode
    return
  }
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = rect.x + rect.width / 2
  const y = rect.y + rect.height / 2
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  changingRef.value = true
  document.documentElement.dataset.themeTransition = 'capturing'
  try {
    transition = document.startViewTransition(async () => {
      const previewApplied = waitForPreviewTheme(targetMode)
      modeRef.value = targetMode
      await nextTick()
      await previewApplied
    })
    await transition.ready
    animation = document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      {
        duration: 650,
        easing: 'cubic-bezier(.16,1,.3,1)',
        pseudoElement: '::view-transition-new(root)',
      },
    )
    document.documentElement.dataset.themeTransition = 'revealing'
    await transition.finished
  } catch {
    transition?.skipTransition()
    modeRef.value = targetMode
  } finally {
    animation?.cancel()
    animation = undefined
    transition = undefined
    delete document.documentElement.dataset.themeTransition
    changingRef.value = false
  }
}
</script>
<template>
  <Button
    variant="ghost"
    size="icon"
    data-cursor="none"
    :aria-label="t(modeRef === 'light' ? 'Use dark theme' : 'Use light theme')"
    :aria-busy="changingRef"
    @click="toggle"
  >
    <motion.span
      :key="modeRef"
      class="inline-flex [view-transition-name:theme-toggle]"
      :initial="reducedRef || changingRef ? false : { opacity: 0, rotate: -90, scale: 0.4 }"
      :animate="{ opacity: 1, rotate: 0, scale: 1 }"
      :transition="{ duration: reducedRef ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }"
      ><Moon v-if="modeRef === 'light'" /><Sun v-else
    /></motion.span>
  </Button>
</template>

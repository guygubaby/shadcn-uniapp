<script setup lang="ts">
import { nextTick, onUnmounted, provide, ref, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useReducedMotion } from 'motion-v'
import { routeReadyKey } from '@/lib/motion'
const router = useRouter()
const fillRef = useTemplateRef<HTMLDivElement>('fill')
const activeRef = ref(false)
const readyRef = ref(true)
const reducedRef = useReducedMotion()
provide(routeReadyKey, readyRef)
let animations: Animation[] = []
let page: HTMLElement | undefined
let overflowBefore: string | undefined
let pendingDone: (() => void) | undefined
let navigation = 0
function restore() {
  page?.removeAttribute('inert')
  if (overflowBefore !== undefined) document.documentElement.style.overflow = overflowBefore
  overflowBefore = undefined
}
function settle() {
  navigation++
  for (const animation of animations) animation.cancel()
  animations = []
  restore()
  activeRef.value = false
  readyRef.value = true
  const done = pendingDone
  pendingDone = undefined
  done?.()
}
async function leave(element: Element, done: () => void) {
  settle()
  if (reducedRef.value || !fillRef.value) {
    // Finish Vue's current patch before resolving an out-in leave.
    await nextTick()
    done()
    return
  }
  const current = navigation
  page = element as HTMLElement
  pendingDone = done
  readyRef.value = false
  activeRef.value = true
  page.setAttribute('inert', '')
  overflowBefore = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
  await nextTick()
  if (current !== navigation || !fillRef.value) return
  const cover = fillRef.value.animate(
    [
      { transform: 'scaleY(0)', opacity: 1 },
      { transform: 'scaleY(1)', opacity: 1 },
    ],
    { duration: 700, easing: 'cubic-bezier(.76,0,.2,1)', fill: 'forwards' },
  )
  const lift = page.animate(
    [
      { transform: 'translateY(0)', opacity: 1 },
      { transform: `translateY(${innerWidth > innerHeight ? '-10vh' : '-5vh'})`, opacity: 0.65 },
    ],
    { duration: 900, easing: 'cubic-bezier(.76,0,.2,1)', fill: 'forwards' },
  )
  animations.push(cover, lift)
  try {
    await cover.finished
  } catch {
    return
  }
  if (current === navigation) {
    pendingDone = undefined
    done()
  }
}
async function enter(element: Element, done: () => void) {
  const current = navigation
  readyRef.value = true
  restore()
  if (!activeRef.value || reducedRef.value || !fillRef.value) {
    settle()
    done()
    return
  }
  const reveal = fillRef.value.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 400,
    easing: 'ease-out',
    fill: 'forwards',
  })
  animations.push(reveal)
  pendingDone = done
  try {
    await reveal.finished
  } catch {
    return
  }
  if (current !== navigation) return
  settle()
  document.getElementById('main-content')?.focus({ preventScroll: true })
}
watch(reducedRef, (reduced) => {
  if (reduced) for (const animation of animations) animation.finish()
})
const removeError = router.onError(settle)
onUnmounted(() => {
  removeError()
  settle()
})
</script>
<template>
  <RouterView v-slot="{ Component, route }">
    <Transition
      :css="false"
      mode="out-in"
      @leave="leave"
      @enter="enter"
      @leave-cancelled="settle"
      @enter-cancelled="settle"
    >
      <div :key="route.path" class="route-page"><component :is="Component" /></div>
    </Transition>
  </RouterView>
  <div
    v-show="activeRef"
    aria-hidden="true"
    class="route-cover fixed inset-0 z-50"
    :class="!readyRef && 'bg-black/30'"
  >
    <div ref="fill" class="absolute inset-0 origin-bottom bg-white" style="transform: scaleY(0)" />
  </div>
</template>

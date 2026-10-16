import { inject, onMounted, ref, watch } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import { useInView, useReducedMotion } from 'motion-v'

export const routeReadyKey: InjectionKey<Ref<boolean>> = Symbol('route-ready')
export const revealEase = [0.16, 1, 0.3, 1] as const

export function useReveal(target: Ref<HTMLElement | null>) {
  const readyRef = inject(routeReadyKey, ref(true))
  const reducedRef = useReducedMotion()
  const inViewRef = useInView(target, { once: true, margin: '0px 0px -5% 0px' })
  const shownRef = ref(true)
  onMounted(() => {
    if (!reducedRef.value && !inViewRef.value) shownRef.value = false
  })
  watch(
    [readyRef, reducedRef, inViewRef],
    () => {
      if (reducedRef.value || (readyRef.value && inViewRef.value)) shownRef.value = true
    },
    { immediate: true },
  )
  return { shownRef, reducedRef }
}

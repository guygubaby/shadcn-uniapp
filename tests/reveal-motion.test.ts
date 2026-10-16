import { afterEach, expect, it, vi } from 'vitest'
import { createRenderer, nextTick, ref } from '../apps/site/node_modules/vue'
import type { Ref } from '../apps/site/node_modules/vue'

const visibility = vi.hoisted(() => ({}) as { inView: Ref<boolean>; reduced: Ref<boolean> })
vi.mock('../apps/site/node_modules/motion-v', () => ({
  useInView: () => visibility.inView,
  useReducedMotion: () => visibility.reduced,
}))
import { routeReadyKey, useReveal } from '../apps/site/src/lib/motion'

const cleanup: (() => void)[] = []
afterEach(() => {
  cleanup.splice(0).forEach((unmount) => unmount())
  vi.unstubAllEnvs()
})

function mountReveal({ server = false, reduced = false, ready = true } = {}) {
  vi.stubEnv('SSR', server)
  visibility.inView = ref(false)
  visibility.reduced = ref(reduced)
  const readyRef = ref(ready)
  const renders: boolean[] = []
  let state!: ReturnType<typeof useReveal>
  const renderer = createRenderer({
    createElement: () => ({}),
    createText: () => ({}),
    createComment: () => ({}),
    insert() {},
    remove() {},
    patchProp() {},
    setText() {},
    setElementText() {},
    parentNode: () => null,
    nextSibling: () => null,
  })
  const app = renderer.createApp({
    setup() {
      state = useReveal(ref(null))
      return () => {
        renders.push(state.shownRef.value)
        return null
      }
    },
  })
  app.provide(routeReadyKey, readyRef)
  app.mount({})
  cleanup.push(() => app.unmount())
  return { state, renders, readyRef }
}

it('renders the first client frame hidden before revealing an already visible hero', async () => {
  const { renders, state } = mountReveal()
  expect(renders[0]).toBe(false)
  visibility.inView.value = true
  await nextTick()
  expect(state.shownRef.value).toBe(true)
  visibility.inView.value = false
  await nextTick()
  expect(state.shownRef.value).toBe(true)
})

it('keeps prerendered content and reduced-motion views readable immediately', () => {
  expect(mountReveal({ server: true }).renders[0]).toBe(true)
  expect(mountReveal({ reduced: true }).renders[0]).toBe(true)
})

it('waits for the route cover before revealing incoming content', async () => {
  const { state, readyRef } = mountReveal({ ready: false })
  visibility.inView.value = true
  await nextTick()
  expect(state.shownRef.value).toBe(false)
  readyRef.value = true
  await nextTick()
  expect(state.shownRef.value).toBe(true)
})

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { LoaderCircle, RefreshCw } from '@lucide/vue'
import type { ThemeConfig, ThemeMode } from 'shadcn-uniapp'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{ theme: ThemeConfig; mode?: ThemeMode; block?: string; canvas?: boolean }>(),
  { mode: 'light', block: 'components', canvas: false },
)
const frameRef = useTemplateRef<HTMLIFrameElement>('frame')
const readyRef = ref(false)
const failedRef = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function send() {
  frameRef.value?.contentWindow?.postMessage(
    {
      type: 'shadcn-uniapp:theme',
      theme: JSON.parse(JSON.stringify(props.theme)),
      mode: props.mode,
      block: props.block,
      canvas: props.canvas,
    },
    window.location.origin,
  )
}
function receive(event: MessageEvent) {
  if (event.origin !== window.location.origin || event.source !== frameRef.value?.contentWindow)
    return
  if (event.data?.type === 'shadcn-uniapp:ready') {
    clearTimeout(timer)
    readyRef.value = true
    failedRef.value = false
    send()
  }
}
function retry() {
  readyRef.value = false
  failedRef.value = false
  frameRef.value?.contentWindow?.location.reload()
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (!readyRef.value) failedRef.value = true
  }, 15000)
}
watch(() => [props.theme, props.mode, props.block, props.canvas], send, { deep: true })
onMounted(() => {
  window.addEventListener('message', receive)
  timer = setTimeout(() => {
    if (!readyRef.value) failedRef.value = true
  }, 15000)
})
onUnmounted(() => {
  clearTimeout(timer)
  window.removeEventListener('message', receive)
})
</script>

<template>
  <div
    :class="
      cn(
        'relative min-w-0 overflow-hidden rounded-xl border bg-background',
        canvas && 'h-full rounded-none border-0 bg-transparent',
      )
    "
  >
    <div
      v-if="!canvas"
      class="flex items-center justify-between gap-3 border-b px-4 py-3 text-xs text-muted-foreground"
    >
      <span>Live uni-app H5 preview</span><span>Wot UI 2.3.2</span>
    </div>
    <iframe
      ref="frame"
      src="/preview/index.html#/"
      title="Live Wot UI component preview"
      :class="cn('block w-full border-0', canvas ? 'h-full min-h-180' : 'h-152')"
      @load="send"
    />
    <div
      v-if="!readyRef"
      class="absolute inset-x-0 top-12 bottom-0 flex flex-col items-center justify-center gap-4 bg-background p-6 text-center"
    >
      <template v-if="failedRef">
        <p class="text-sm text-muted-foreground">
          The preview could not start. Check your connection and make sure the H5 preview is built.
        </p>
        <Button variant="outline" @click="retry"><RefreshCw />Reload preview</Button>
      </template>
      <template v-else
        ><LoaderCircle class="size-5 animate-spin motion-reduce:animate-none" />
        <p class="text-sm text-muted-foreground">Starting Wot components...</p></template
      >
    </div>
  </div>
</template>

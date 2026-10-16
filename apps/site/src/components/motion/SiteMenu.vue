<script setup lang="ts">
import { nextTick, ref, useId, useTemplateRef, watch } from 'vue'
import { onClickOutside, useMediaQuery } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { Menu, X } from '@lucide/vue'
import { useI18n } from '@/lib/i18n'
import ExpandPanel from './ExpandPanel.vue'

defineProps<{ links: { to: string; label: string }[] }>()
const { t, localePath } = useI18n()
const route = useRoute()
const id = useId()
const openRef = ref(false)
const wideRef = useMediaQuery('(min-width: 640px)')
const menuRef = useTemplateRef<HTMLElement>('menu')
const triggerRef = useTemplateRef<HTMLButtonElement>('trigger')
function close() {
  openRef.value = false
  triggerRef.value?.focus()
}
onClickOutside(menuRef, () => {
  openRef.value = false
})
watch([() => route.path, wideRef], () => {
  openRef.value = false
})
watch(openRef, async (open) => {
  if (open) {
    await nextTick()
    if (openRef.value) menuRef.value?.querySelector<HTMLAnchorElement>('nav a')?.focus()
  }
})
</script>
<template>
  <div ref="menu" class="relative sm:hidden" @keydown.esc.stop.prevent="close">
    <button
      ref="trigger"
      class="flex size-10 scale-100 items-center justify-center rounded-md border transition-[scale] active:scale-[0.96] motion-reduce:transition-none"
      :aria-label="t('Open navigation')"
      :aria-expanded="openRef"
      :aria-controls="id"
      @click="openRef = !openRef"
    >
      <component :is="openRef ? X : Menu" class="size-5" />
    </button>
    <div class="absolute top-12 right-0 w-44">
      <ExpandPanel :open="openRef">
        <nav
          :id="id"
          :aria-label="t('Mobile navigation')"
          class="flex flex-col gap-1 rounded-xl border bg-background p-2 shadow-lg"
        >
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="localePath(link.to)"
            class="nav-link rounded-lg px-3 py-3 text-sm transition-colors hover:bg-muted"
            @click="openRef = false"
            >{{ t(link.label) }}</RouterLink
          >
        </nav>
      </ExpandPanel>
    </div>
  </div>
</template>

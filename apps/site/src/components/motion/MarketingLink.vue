<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { ArrowUpRight } from '@lucide/vue'

const { t } = useI18n()
defineProps<{ to: string; label: string }>()
</script>
<template>
  <RouterLink
    :to="to"
    :aria-label="t(label)"
    class="group relative isolate inline-flex h-12 items-center justify-center gap-5 overflow-hidden rounded-full border border-foreground px-6 text-sm font-semibold text-foreground transition-colors duration-500 hover:text-background focus-visible:text-background motion-reduce:transition-none"
  >
    <span
      aria-hidden="true"
      class="absolute inset-0 -z-10 origin-bottom translate-y-full rounded-t-full bg-foreground transition-transform duration-600 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
    />
    <span aria-hidden="true" class="relative block h-5 overflow-hidden"
      ><span
        class="block transition-transform duration-500 ease-out group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none"
        >{{ t(label) }}</span
      ><span
        class="absolute top-full left-0 block transition-transform duration-500 ease-out group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none"
        >{{ t(label) }}</span
      ></span
    >
    <ArrowUpRight
      aria-hidden="true"
      class="size-4 transition-transform duration-500 group-hover:rotate-45 group-focus-visible:rotate-45 motion-reduce:transition-none"
    />
  </RouterLink>
</template>

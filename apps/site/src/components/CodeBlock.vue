<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { Copy } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { copyText } from '@/lib/browser'

const { t } = useI18n()
defineProps<{ code: string; label?: string }>()
</script>

<template>
  <div
    class="min-w-0 rounded-lg border bg-muted/60 transition-[border-color,box-shadow] duration-300 hover:border-foreground/25 hover:shadow-sm motion-reduce:transition-none"
  >
    <div class="flex items-center justify-between gap-3 border-b px-4 py-2">
      <span class="text-xs text-muted-foreground">{{ t(label ?? 'Terminal') }}</span>
      <Button variant="ghost" size="sm" @click="copyText(code)"><Copy />{{ t('Copy') }}</Button>
    </div>
    <pre class="overflow-x-auto p-4 text-xs leading-7 sm:text-sm"><code>{{ code }}</code></pre>
  </div>
</template>

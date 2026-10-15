<script setup lang="ts">
import { Copy } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { copyText } from '@/lib/browser'
defineProps<{ code: string; label?: string }>()
</script>

<template>
  <div class="min-w-0 rounded-lg border bg-muted/60">
    <div class="flex items-center justify-between gap-3 border-b px-4 py-2">
      <span class="text-xs text-muted-foreground">{{ label ?? 'Terminal' }}</span>
      <Button variant="ghost" size="sm" @click="copyText(code)"><Copy />Copy</Button>
    </div>
    <pre class="overflow-x-auto p-4 text-xs leading-7 sm:text-sm"><code>{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{ label: string; value: string; change: string; progress: number }>()
</script>
<template>
  <wd-cell :title="t(label)"
    ><wd-tag type="success" variant="light">{{ t(change) }}</wd-tag></wd-cell
  >
  <view class="py-4"
    ><text class="text-4xl font-semibold tracking-[-1px] tabular-nums">{{ t(value) }}</text></view
  >
  <wd-progress :percentage="progress" />
</template>

<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{ label: string; value: string; change: string; progress: number }>()
</script>
<template>
  <wd-cell :title="t(label)"
    ><wd-tag type="success" variant="light">{{ t(change) }}</wd-tag></wd-cell
  >
  <view style="padding: 16px 0"
    ><text
      style="
        font-size: 36px;
        font-weight: 600;
        letter-spacing: -1px;
        font-variant-numeric: tabular-nums;
      "
      >{{ t(value) }}</text
    ></view
  >
  <wd-progress :percentage="progress" />
</template>

<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{
  orderNumber: string
  expectedDate: string
  active: number
  steps: { title: string; description?: string }[]
}>()
defineEmits<{ track: [] }>()
</script>
<template>
  <wd-cell :title="`${t('Order')} #${orderNumber}`" :value="t(expectedDate)" />
  <wd-divider />
  <wd-steps :active="active" vertical>
    <wd-step
      v-for="step in steps"
      :key="step.title"
      :title="t(step.title)"
      :description="t(step.description)"
    />
  </wd-steps>
  <wd-gap :height="16" />
  <wd-button block variant="plain" @click="$emit('track')">{{ t('Track package') }}</wd-button>
</template>

<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{
  applicant: string
  program: string
  active: number
  steps: { title: string; description?: string }[]
}>()
defineEmits<{ continue: [] }>()
</script>
<template>
  <wd-cell :title="t(applicant)" :label="t(program)"
    ><wd-tag type="primary" variant="light">{{ t('In progress') }}</wd-tag></wd-cell
  >
  <wd-divider />
  <wd-steps :active="active" vertical
    ><wd-step
      v-for="step in steps"
      :key="step.title"
      :title="t(step.title)"
      :description="t(step.description)"
  /></wd-steps>
  <wd-button block @click="$emit('continue')">{{ t('Continue application') }}</wd-button>
</template>

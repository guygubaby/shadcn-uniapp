<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

withDefaults(
  defineProps<{
    name: string
    description?: string
    workspace?: string
  }>(),
  { description: '', workspace: 'Personal' },
)

defineEmits<{ edit: [] }>()
</script>

<template>
  <wd-cell-group border>
    <wd-cell :title="t(name)" :label="t(description)" />
    <wd-cell :title="t('Workspace')" :value="workspace" />
    <wd-cell :title="t('Edit profile')" is-link @click="$emit('edit')" />
  </wd-cell-group>
</template>

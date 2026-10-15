<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{ actions: { id: string; title: string; icon: string }[] }>()
defineEmits<{ select: [id: string] }>()
</script>
<template>
  <wd-grid :column="3" clickable>
    <wd-grid-item
      v-for="action in actions"
      :key="action.id"
      :icon="action.icon"
      :text="t(action.title)"
      @click="$emit('select', action.id)"
    />
  </wd-grid>
</template>

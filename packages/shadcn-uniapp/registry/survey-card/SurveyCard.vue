<script setup lang="ts">
import { inject } from 'vue'
import { CalendarDays } from '@lucide/vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{ title: string; description: string; deadline: string; completed?: boolean }>()
defineEmits<{ start: []; review: [] }>()
</script>
<template>
  <wd-cell :title="t(title)" :label="t(description)"
    ><wd-tag :type="completed ? 'success' : 'warning'" variant="light">{{
      t(completed ? 'Completed' : 'Action needed')
    }}</wd-tag></wd-cell
  >
  <wd-cell :title="t('Respond by')" :value="deadline">
    <template #prefix><CalendarDays :size="20" /></template>
  </wd-cell>
  <wd-divider />
  <wd-button v-if="completed" block variant="plain" @click="$emit('review')">{{
    t('Review response')
  }}</wd-button>
  <wd-button v-else block @click="$emit('start')">{{ t('Complete survey') }}</wd-button>
</template>

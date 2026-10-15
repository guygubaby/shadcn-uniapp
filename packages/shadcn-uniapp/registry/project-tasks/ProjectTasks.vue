<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, shallowRef, watch } from 'vue'
const props = defineProps<{ tasks: { id: string; label: string }[]; completed?: string[] }>()
const emit = defineEmits<{ change: [completed: string[]] }>()
const completedRef = shallowRef(
  (props.completed ?? []).filter((id) => props.tasks.some((task) => task.id === id)),
)
const progress = computed(() =>
  props.tasks.length ? Math.round((completedRef.value.length / props.tasks.length) * 100) : 0,
)
watch(completedRef, (value) => emit('change', value))
</script>
<template>
  <wd-progress :percentage="progress" />
  <wd-checkbox-group v-model="completedRef" shape="square">
    <wd-checkbox v-for="task in tasks" :key="task.id" :name="task.id">{{
      t(task.label)
    }}</wd-checkbox>
  </wd-checkbox-group>
  <wd-text
    :text="`${completedRef.length}/${tasks.length} ${t('tasks completed')}`"
    color="var(--sui-muted-foreground)"
  />
</template>

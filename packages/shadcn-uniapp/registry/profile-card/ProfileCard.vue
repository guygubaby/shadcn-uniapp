<script setup lang="ts">
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
    <wd-cell :title="name" :label="description" />
    <wd-cell title="Workspace" :value="workspace" />
    <wd-cell title="Edit profile" is-link @click="$emit('edit')" />
  </wd-cell-group>
</template>

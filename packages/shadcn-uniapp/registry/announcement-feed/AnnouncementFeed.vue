<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { shallowRef } from 'vue'
const props = defineProps<{
  sections: {
    id: string
    title: string
    items: { id: string; title: string; date: string; unread?: boolean }[]
  }[]
}>()
defineEmits<{ open: [id: string] }>()
const expandedRef = shallowRef(props.sections.slice(0, 1).map((section) => section.id))
</script>
<template>
  <wd-collapse v-model="expandedRef">
    <wd-collapse-item
      v-for="section in sections"
      :key="section.id"
      :name="section.id"
      :title="t(section.title)"
    >
      <wd-cell
        v-for="item in section.items"
        :key="item.id"
        :title="t(item.title)"
        :label="t(item.date)"
        is-link
        @click="$emit('open', item.id)"
      >
        <wd-tag v-if="item.unread" type="primary" variant="light">{{ t('New') }}</wd-tag>
      </wd-cell>
    </wd-collapse-item>
  </wd-collapse>
</template>

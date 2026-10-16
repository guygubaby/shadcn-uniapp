<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { shallowRef } from 'vue'
defineProps<{
  messages: {
    id: string
    category: string
    title: string
    description: string
    date: string
    read: boolean
  }[]
}>()
const emit = defineEmits<{ open: [id: string]; read: [id: string] }>()
const readIdsRef = shallowRef<string[]>([])
function markRead(id: string) {
  readIdsRef.value = [...readIdsRef.value, id]
  emit('read', id)
}
</script>
<template>
  <view
    v-for="message in messages"
    :key="message.id"
    style="padding: 16px 0; border-bottom: 1px solid var(--sui-border)"
  >
    <view style="display: flex; align-items: center; justify-content: space-between; gap: 12px"
      ><wd-tag variant="light">{{ t(message.category) }}</wd-tag
      ><wd-text :text="t(message.date)" color="var(--sui-muted-foreground)"
    /></view>
    <wd-cell
      :title="t(message.title)"
      :label="t(message.description)"
      is-link
      @click="$emit('open', message.id)"
    />
    <wd-gap :height="12" />
    <wd-button
      v-if="!message.read && !readIdsRef.includes(message.id)"
      size="small"
      variant="plain"
      @click="markRead(message.id)"
      >{{ t('Mark as read') }}</wd-button
    >
    <wd-tag v-else type="success" variant="light">{{ t('Read') }}</wd-tag>
  </view>
  <wd-empty v-if="!messages.length" :description="t('Your inbox is empty')" />
</template>

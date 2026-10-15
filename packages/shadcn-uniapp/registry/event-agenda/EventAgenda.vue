<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{
  events: {
    id: string
    day: string
    month: string
    title: string
    time: string
    location: string
    category: string
  }[]
}>()
defineEmits<{ open: [id: string] }>()
</script>
<template>
  <view
    v-for="event in events"
    :key="event.id"
    style="
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid var(--sui-border);
    "
  >
    <view
      style="
        min-width: 46px;
        padding: 10px;
        border-radius: var(--sui-radius);
        background: var(--sui-muted);
        text-align: center;
      "
      ><text style="display: block; font-size: 24px; font-weight: 700">{{ t(event.day) }}</text
      ><wd-text :text="t(event.month)" color="var(--sui-muted-foreground)"
    /></view>
    <view style="flex: 1; min-width: 0"
      ><text style="display: block; font-weight: 600">{{ t(event.title) }}</text
      ><wd-text
        :text="t(`${event.time} · ${event.location}`)"
        color="var(--sui-muted-foreground)"
      /><view style="margin-top: 8px"
        ><wd-tag variant="light">{{ t(event.category) }}</wd-tag></view
      ></view
    >
    <wd-button size="small" variant="text" @click="$emit('open', event.id)">{{
      t('View')
    }}</wd-button>
  </view>
  <wd-empty v-if="!events.length" :description="t('No upcoming events')" />
</template>

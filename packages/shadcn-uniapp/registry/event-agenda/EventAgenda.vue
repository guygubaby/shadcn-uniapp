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
    class="flex items-center gap-4 border-0 border-b border-solid border-(--sui-border) py-4"
  >
    <view class="min-w-11.5 rounded-(--sui-radius) bg-(--sui-muted) p-2.5 text-center"
      ><text class="block text-2xl font-bold">{{ t(event.day) }}</text
      ><wd-text :text="t(event.month)" color="var(--sui-muted-foreground)"
    /></view>
    <view class="min-w-0 flex-1"
      ><text class="block font-semibold">{{ t(event.title) }}</text
      ><wd-text
        :text="t(`${event.time} · ${event.location}`)"
        color="var(--sui-muted-foreground)"
      /><view class="mt-2"
        ><wd-tag variant="light">{{ t(event.category) }}</wd-tag></view
      ></view
    >
    <wd-button size="small" variant="text" @click="$emit('open', event.id)">{{
      t('View')
    }}</wd-button>
  </view>
  <wd-empty v-if="!events.length" :description="t('No upcoming events')" />
</template>

<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { ref } from 'vue'
const props = defineProps<{ minDate: number; maxDate: number; date?: number }>()
const emit = defineEmits<{ reserve: [value: { date: number; guests: number }] }>()
const dateRef = ref(props.date ?? props.minDate)
const guestsRef = ref(2)
</script>
<template>
  <wd-calendar-view v-model="dateRef" :min-date="minDate" :max-date="maxDate" :panel-height="310" />
  <wd-cell :title="t('Guests')"><wd-input-number v-model="guestsRef" :min="1" :max="8" /></wd-cell>
  <wd-gap :height="16" />
  <wd-button block @click="emit('reserve', { date: dateRef, guests: guestsRef })">{{
    t('Reserve a time')
  }}</wd-button>
</template>

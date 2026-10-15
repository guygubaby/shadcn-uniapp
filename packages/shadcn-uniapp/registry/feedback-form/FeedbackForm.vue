<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { ref } from 'vue'
const emit = defineEmits<{ submit: [value: { rating: number; comment: string }] }>()
const ratingRef = ref(4)
const commentRef = ref('')
</script>
<template>
  <view style="padding: 12px 0"><wd-rate v-model="ratingRef" :size="28" /></view>
  <wd-textarea
    v-model="commentRef"
    :placeholder="t('What worked well? What could feel better?')"
    :maxlength="240"
    show-word-limit
  />
  <wd-button
    block
    :disabled="ratingRef < 1"
    @click="emit('submit', { rating: ratingRef, comment: commentRef.trim() })"
    >{{ t('Send feedback') }}</wd-button
  >
</template>

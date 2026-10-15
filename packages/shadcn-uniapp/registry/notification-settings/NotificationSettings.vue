<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { ref } from 'vue'
const props = defineProps<{ mentions?: boolean; newsletter?: boolean }>()
const emit = defineEmits<{
  save: [value: { mentions: boolean; newsletter: boolean; frequency: string }]
}>()
const mentionsRef = ref(props.mentions ?? true)
const newsletterRef = ref(props.newsletter ?? false)
const frequencyRef = ref('weekly')
</script>
<template>
  <wd-cell-group border>
    <wd-cell :title="t('Mentions & replies')" :label="t('When someone needs your attention')"
      ><wd-switch v-model="mentionsRef" :aria-label="t('Mentions and replies')"
    /></wd-cell>
    <wd-cell :title="t('Product newsletter')" :label="t('A little inspiration in your inbox')"
      ><wd-switch v-model="newsletterRef" :aria-label="t('Product newsletter')"
    /></wd-cell>
  </wd-cell-group>
  <wd-form-item :title="t('Summary frequency')"
    ><wd-radio-group v-model="frequencyRef" inline
      ><wd-radio value="daily">{{ t('Daily') }}</wd-radio
      ><wd-radio value="weekly">{{ t('Weekly') }}</wd-radio></wd-radio-group
    ></wd-form-item
  >
  <wd-button
    block
    @click="
      emit('save', { mentions: mentionsRef, newsletter: newsletterRef, frequency: frequencyRef })
    "
    >{{ t('Save preferences') }}</wd-button
  >
</template>

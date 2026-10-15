<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, ref } from 'vue'
const props = defineProps<{ item: { name: string; priceCents: number }; quantity?: number }>()
const emit = defineEmits<{ checkout: [value: { quantity: number; totalCents: number }] }>()
const quantityRef = ref(props.quantity ?? 1)
const totalCents = computed(() => quantityRef.value * props.item.priceCents)
</script>
<template>
  <wd-cell :title="t(item.name)" :label="t(`$${(item.priceCents / 100).toFixed(2)} each`)"
    ><wd-input-number v-model="quantityRef" :min="1" :max="10"
  /></wd-cell>
  <wd-divider />
  <wd-cell :title="t('Subtotal')" :value="`$${(totalCents / 100).toFixed(2)}`" />
  <wd-cell :title="t('Shipping')"
    ><wd-tag type="success" variant="light">{{ t('On us') }}</wd-tag></wd-cell
  >
  <wd-cell :title="t('Total')" :value="`$${(totalCents / 100).toFixed(2)}`" />
  <wd-button block @click="emit('checkout', { quantity: quantityRef, totalCents })">{{
    t('Review order')
  }}</wd-button>
</template>

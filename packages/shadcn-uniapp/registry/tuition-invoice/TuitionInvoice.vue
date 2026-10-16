<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, ref } from 'vue'
import { GraduationCap, FileText, ShieldCheck, CircleHelp } from '@lucide/vue'
const props = withDefaults(
  defineProps<{
    invoiceId: string
    student: { name: string; grade: string; initials: string }
    term: string
    dueDate: string
    fees: { label: string; amountCents: number }[]
    currencySymbol?: string
    loading?: boolean
  }>(),
  { currencySymbol: '¥' },
)
const emit = defineEmits<{
  pay: [value: { invoiceId: string; payment: string }]
  download: [invoiceId: string]
  contact: []
}>()
const paymentRef = ref('transfer')
const totalCents = computed(() => props.fees.reduce((sum, fee) => sum + fee.amountCents, 0))
const money = (cents: number) => `${props.currencySymbol}${(cents / 100).toFixed(2)}`
function pay() {
  if (!props.loading && totalCents.value > 0)
    emit('pay', { invoiceId: props.invoiceId, payment: paymentRef.value })
}
</script>

<template>
  <view class="flex flex-col gap-5 py-2">
    <view class="flex items-center justify-between gap-3"
      ><text class="text-2xl font-semibold">{{ t('School fees') }}</text
      ><wd-tag type="warning" variant="light">{{ t('Awaiting payment') }}</wd-tag></view
    >
    <view class="rounded-2xl bg-[var(--sui-muted)] p-5"
      ><view class="flex items-center gap-3"
        ><wd-avatar :text="student.initials" :size="44" /><view
          ><text class="block font-semibold">{{ student.name }}</text
          ><text class="mt-1 block text-xs text-[var(--sui-muted-foreground)]"
            >{{ t(student.grade) }} · {{ t(term) }}</text
          ></view
        ></view
      ><text class="mt-6 block text-xs text-[var(--sui-muted-foreground)]">{{
        t('Amount due')
      }}</text
      ><text class="mt-2 block text-3xl font-semibold tracking-tight">{{ money(totalCents) }}</text
      ><view class="mt-3 flex items-center gap-2 text-xs"
        ><GraduationCap :size="16" /><text>{{ t('Pay by') }} {{ t(dueDate) }}</text></view
      ></view
    >
    <view
      ><text class="mb-4 block font-semibold">{{ t('Fee breakdown') }}</text
      ><view class="flex flex-col gap-4 text-sm"
        ><view v-for="fee in fees" :key="fee.label" class="flex justify-between gap-4"
          ><text class="text-[var(--sui-muted-foreground)]">{{ t(fee.label) }}</text
          ><text>{{ money(fee.amountCents) }}</text></view
        ><view
          class="flex justify-between border-0 border-t border-solid border-[var(--sui-border)] pt-4 font-semibold"
          ><text>{{ t('Total') }}</text
          ><text>{{ money(totalCents) }}</text></view
        ></view
      ></view
    >
    <view
      ><text class="mb-3 block text-sm font-medium">{{ t('Payment method') }}</text
      ><wd-radio-group v-model="paymentRef" class="flex flex-col gap-3"
        ><wd-radio value="transfer">{{ t('Bank transfer') }}</wd-radio
        ><wd-radio value="wechat">{{ t('WeChat Pay') }}</wd-radio></wd-radio-group
      ></view
    >
    <view class="flex items-start gap-2 text-xs leading-5 text-[var(--sui-muted-foreground)]"
      ><ShieldCheck class="shrink-0" :size="16" /><text>{{
        t('Use the student reference when paying. The finance office confirms receipt.')
      }}</text></view
    >
    <wd-button block :loading="loading" :disabled="loading || totalCents <= 0" @click="pay">{{
      t('Continue to payment')
    }}</wd-button>
    <view class="flex flex-wrap justify-between gap-2"
      ><wd-button size="small" variant="text" @click="emit('download', invoiceId)"
        ><view class="flex items-center gap-1"
          ><FileText :size="16" />{{ t('View invoice') }}</view
        ></wd-button
      ><wd-button size="small" variant="text" @click="emit('contact')"
        ><view class="flex items-center gap-1"
          ><CircleHelp :size="16" />{{ t('Ask finance') }}</view
        ></wd-button
      ></view
    >
    <text class="text-center text-xs text-[var(--sui-muted-foreground)]">{{ invoiceId }}</text>
  </view>
</template>

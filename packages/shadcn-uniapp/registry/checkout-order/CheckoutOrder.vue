<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, ref } from 'vue'
import { MapPin, ShoppingBag, Ticket, ShieldCheck } from '@lucide/vue'
const props = withDefaults(
  defineProps<{
    items: { id: string; name: string; variant: string; quantity: number; priceCents: number }[]
    address: { name: string; phone: string; detail: string }
    shippingCents?: number
    discountCents?: number
    currencySymbol?: string
    loading?: boolean
  }>(),
  { shippingCents: 0, discountCents: 0, currencySymbol: '¥' },
)
const emit = defineEmits<{
  address: []
  confirm: [value: { totalCents: number; couponApplied: boolean; payment: string }]
}>()
const couponRef = ref(false)
const paymentRef = ref('wechat')
const subtotalCents = computed(() =>
  props.items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
)
const appliedDiscount = computed(() =>
  couponRef.value ? Math.min(props.discountCents, subtotalCents.value) : 0,
)
const totalCents = computed(() => subtotalCents.value + props.shippingCents - appliedDiscount.value)
const money = (cents: number) => `${props.currencySymbol}${(cents / 100).toFixed(2)}`
function confirm() {
  if (!props.items.length || props.loading) return
  emit('confirm', {
    totalCents: totalCents.value,
    couponApplied: couponRef.value,
    payment: paymentRef.value,
  })
}
</script>

<template>
  <view class="flex flex-col gap-5 py-2">
    <text class="text-2xl font-semibold">{{ t('Confirm your order') }}</text>
    <view class="rounded-xl bg-[var(--sui-muted)] p-4"
      ><view class="mb-2 flex items-center gap-2 text-sm font-medium"
        ><MapPin :size="18" />{{ t('Deliver to') }}</view
      ><text class="block text-sm">{{ address.name }} · {{ address.phone }}</text
      ><text class="mt-2 block text-sm leading-6 text-[var(--sui-muted-foreground)]">{{
        t(address.detail)
      }}</text
      ><view class="mt-2"
        ><wd-button size="small" variant="text" @click="emit('address')">{{
          t('Change address')
        }}</wd-button></view
      ></view
    >
    <view class="flex flex-col gap-4"
      ><view v-for="item in items" :key="item.id" class="flex items-center gap-3"
        ><view
          class="flex size-16 shrink-0 items-center justify-center rounded-lg bg-[var(--sui-muted)]"
          ><ShoppingBag :size="26" /></view
        ><view class="min-w-0 flex-1"
          ><text class="block text-sm font-medium">{{ t(item.name) }}</text
          ><text class="mt-1 block text-xs text-[var(--sui-muted-foreground)]"
            >{{ t(item.variant) }} · ×{{ item.quantity }}</text
          ></view
        ><text class="text-sm font-semibold">{{
          money(item.priceCents * item.quantity)
        }}</text></view
      ></view
    >
    <wd-cell
      v-if="discountCents > 0"
      :title="t('Use welcome coupon')"
      :label="`${t('Save on this order')} ${money(discountCents)}`"
      center
      ><template #prefix><Ticket class="mr-2" :size="20" /></template
      ><wd-switch v-model="couponRef" :aria-label="t('Use welcome coupon')"
    /></wd-cell>
    <view
      class="flex flex-col gap-3 border-0 border-y border-solid border-[var(--sui-border)] py-4 text-sm"
      ><view class="flex justify-between"
        ><text class="text-[var(--sui-muted-foreground)]">{{ t('Subtotal') }}</text
        ><text>{{ money(subtotalCents) }}</text></view
      ><view class="flex justify-between"
        ><text class="text-[var(--sui-muted-foreground)]">{{ t('Shipping') }}</text
        ><text>{{ shippingCents ? money(shippingCents) : t('Free delivery') }}</text></view
      ><view v-if="appliedDiscount" class="flex justify-between"
        ><text>{{ t('Discount') }}</text
        ><text>−{{ money(appliedDiscount) }}</text></view
      ></view
    >
    <view
      ><text class="mb-3 block text-sm font-medium">{{ t('Payment method') }}</text
      ><wd-radio-group v-model="paymentRef" class="sui-choice-group"
        ><wd-radio value="wechat">{{ t('WeChat Pay') }}</wd-radio
        ><wd-radio value="card">{{ t('Bank card') }}</wd-radio></wd-radio-group
      ></view
    >
    <view class="flex items-center justify-between gap-3"
      ><view
        ><text class="block text-xs text-[var(--sui-muted-foreground)]">{{ t('Total') }}</text
        ><text class="mt-1 block text-2xl font-semibold">{{ money(totalCents) }}</text></view
      ><wd-button :loading="loading" :disabled="!items.length || loading" @click="confirm">{{
        t('Place order')
      }}</wd-button></view
    >
    <view class="flex items-center justify-center gap-2 text-xs text-[var(--sui-muted-foreground)]"
      ><ShieldCheck :size="14" />{{ t('Review your details before placing an order.') }}</view
    >
  </view>
</template>

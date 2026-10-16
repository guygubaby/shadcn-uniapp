<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import {
  Bell,
  ChevronRight,
  CreditCard,
  Package,
  Truck,
  MessageSquare,
  MapPin,
  Headphones,
  Settings,
  Ticket,
  Heart,
  Star,
} from '@lucide/vue'

defineProps<{
  name: string
  initials: string
  account: string
  coupons?: number
  favorites?: number
  points?: number
}>()
defineEmits<{ select: [destination: string] }>()
</script>

<template>
  <view class="flex flex-col gap-6 py-2">
    <view class="flex items-center justify-between gap-3"
      ><text class="text-xl font-semibold">{{ t('My account') }}</text
      ><wd-button
        variant="text"
        size="small"
        :aria-label="t('Notifications')"
        @click="$emit('select', 'notifications')"
        ><Bell :size="22" /></wd-button
    ></view>
    <view class="flex items-center gap-4"
      ><wd-avatar :text="initials" :size="60" /><view class="min-w-0 flex-1"
        ><text class="block text-xl font-semibold">{{ name }}</text
        ><text class="mt-1 block text-sm text-[var(--sui-muted-foreground)]">{{
          account
        }}</text></view
      ><wd-button
        variant="text"
        size="small"
        :aria-label="t('Edit profile')"
        @click="$emit('select', 'profile')"
        ><ChevronRight :size="20" /></wd-button
    ></view>
    <view class="grid grid-cols-3 gap-2 rounded-2xl bg-[var(--sui-muted)] py-4 text-center">
      <button
        class="m-0 flex h-auto flex-col items-center gap-1 rounded-none border-0 bg-transparent p-0 leading-normal text-inherit after:border-0"
        @click="$emit('select', 'coupons')"
      >
        <view class="flex flex-col items-center gap-1"
          ><Ticket :size="18" /><text class="text-lg font-semibold">{{ coupons ?? 0 }}</text
          ><text class="text-xs">{{ t('Coupons') }}</text></view
        >
      </button>
      <button
        class="m-0 flex h-auto flex-col items-center gap-1 rounded-none border-0 bg-transparent p-0 leading-normal text-inherit after:border-0"
        @click="$emit('select', 'favorites')"
      >
        <view class="flex flex-col items-center gap-1"
          ><Heart :size="18" /><text class="text-lg font-semibold">{{ favorites ?? 0 }}</text
          ><text class="text-xs">{{ t('Favorites') }}</text></view
        >
      </button>
      <button
        class="m-0 flex h-auto flex-col items-center gap-1 rounded-none border-0 bg-transparent p-0 leading-normal text-inherit after:border-0"
        @click="$emit('select', 'points')"
      >
        <view class="flex flex-col items-center gap-1"
          ><Star :size="18" /><text class="text-lg font-semibold">{{ points ?? 0 }}</text
          ><text class="text-xs">{{ t('Points') }}</text></view
        >
      </button>
    </view>
    <view
      ><view class="mb-3 flex items-center justify-between"
        ><text class="font-semibold">{{ t('My orders') }}</text
        ><wd-button variant="text" size="small" @click="$emit('select', 'orders')">{{
          t('View all')
        }}</wd-button></view
      >
      <wd-grid :column="4" clickable :border="false">
        <wd-grid-item :text="t('To pay')" @click="$emit('select', 'unpaid')"
          ><template #icon><CreditCard :size="24" /></template
        ></wd-grid-item>
        <wd-grid-item :text="t('To ship')" @click="$emit('select', 'processing')"
          ><template #icon><Package :size="24" /></template
        ></wd-grid-item>
        <wd-grid-item :text="t('To receive')" @click="$emit('select', 'shipping')"
          ><template #icon><Truck :size="24" /></template
        ></wd-grid-item>
        <wd-grid-item :text="t('To review')" @click="$emit('select', 'reviews')"
          ><template #icon><MessageSquare :size="24" /></template
        ></wd-grid-item>
      </wd-grid>
    </view>
    <wd-cell-group border>
      <wd-cell :title="t('Shipping addresses')" is-link @click="$emit('select', 'addresses')"
        ><template #prefix><MapPin class="mr-3" :size="20" /></template
      ></wd-cell>
      <wd-cell :title="t('Help and support')" is-link @click="$emit('select', 'support')"
        ><template #prefix><Headphones class="mr-3" :size="20" /></template
      ></wd-cell>
      <wd-cell :title="t('Account settings')" is-link @click="$emit('select', 'settings')"
        ><template #prefix><Settings class="mr-3" :size="20" /></template
      ></wd-cell>
    </wd-cell-group>
  </view>
</template>

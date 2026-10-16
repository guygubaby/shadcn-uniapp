<script setup lang="ts">
import { usePreviewI18n } from '../../../i18n'

import { computed, ref } from 'vue'
import { useToast } from '@wot-ui/ui'
import GallerySection from '../GallerySection.vue'
import { Gift, CreditCard, CircleCheck, Pencil } from '@lucide/vue'

const { t } = usePreviewI18n()
const toast = useToast('layouts')
const payoutRef = ref(2500)
const currencyRef = ref('usd')
const notesRef = ref('')
const paymentRef = ref(0)
const quantityRef = ref(2)
const total = computed(() => (quantityRef.value * 48).toFixed(2))
const transactions = [
  { icon: 'gift', name: 'Studio supplies', date: 'Today, 10:24 AM', amount: '-$48.00' },
  { icon: 'idcard', name: 'Monthly subscription', date: 'Yesterday', amount: '-$19.00' },
  { icon: 'check-circle', name: 'Client payment', date: 'Oct 12', amount: '+$1,240.00' },
]
</script>
<template>
  <GallerySection
    :title="t('Payout threshold')"
    :description="t('Choose when your balance is ready to move.')"
  >
    <wd-form-item :title="t('Preferred currency')"
      ><wd-radio-group v-model="currencyRef" direction="horizontal" custom-class="sui-choice-group"
        ><wd-radio value="usd">{{ t('USD') }}</wd-radio
        ><wd-radio value="eur">{{ t('EUR') }}</wd-radio></wd-radio-group
      ></wd-form-item
    >
    <view class="layout-between"
      ><text class="gallery-description">{{ t('Minimum payout') }}</text
      ><text class="layout-value"
        >{{ t(currencyRef === 'usd' ? '$' : '€') }}{{ t(payoutRef.toLocaleString('en-US')) }}</text
      ></view
    >
    <wd-slider v-model="payoutRef" :min="50" :max="10000" :step="50" />
    <view class="layout-between gallery-description"
      ><text>{{ t('50 min') }}</text
      ><text>{{ t('10,000 max') }}</text></view
    >
    <wd-textarea
      v-model="notesRef"
      :placeholder="t('Add a note for your records')"
      :maxlength="120"
      show-word-limit
    />
    <wd-button block @click="toast.success('Demo threshold saved locally.')">{{
      t('Save threshold')
    }}</wd-button>
  </GallerySection>
  <GallerySection
    :title="t('Available balance')"
    :description="t('A clear picture of what is ready.')"
  >
    <text class="overview-metric">$12,480.00</text
    ><wd-tag type="success" variant="light">{{ t('Available') }}</wd-tag>
    <wd-divider />
    <view class="layout-between"
      ><text class="gallery-description">{{ t('Pending') }}</text
      ><text class="layout-value">$840.00</text></view
    >
    <view class="layout-between"
      ><text class="gallery-description">{{ t('Last payout') }}</text
      ><text class="layout-value">$2,400.00</text></view
    >
    <wd-button block @click="toast.show('This is a balance preview. No funds are moved.')">{{
      t('View balance details')
    }}</wd-button>
  </GallerySection>
  <GallerySection
    :title="t('Savings targets')"
    :description="t('Small steps toward something bigger.')"
  >
    <view class="gallery-surface"
      ><text class="gallery-description">{{ t('NEW STUDIO') }}</text
      ><text class="overview-metric">$24,500</text><wd-progress :percentage="65" /><view
        class="layout-between gallery-description"
        ><text>{{ t('65% achieved') }}</text
        ><text>{{ t('$37,500 goal') }}</text></view
      ></view
    >
    <view class="gallery-surface"
      ><text class="gallery-description">{{ t('NEXT ADVENTURE') }}</text
      ><text class="overview-metric">$4,800</text><wd-progress :percentage="32" /><view
        class="layout-between gallery-description"
        ><text>{{ t('32% achieved') }}</text
        ><text>{{ t('$15,000 goal') }}</text></view
      ></view
    >
    <wd-button
      block
      variant="plain"
      @click="toast.show('Your next goal starts with a small step.')"
      >{{ t('New savings goal') }}</wd-button
    >
  </GallerySection>
  <GallerySection
    :title="t('Recent transactions')"
    :description="t('The little details, all in one place.')"
  >
    <view v-for="item in transactions" :key="item.name" class="overview-person"
      ><Gift v-if="item.icon === 'gift'" :size="22" /><CreditCard
        v-else-if="item.icon === 'idcard'"
        :size="22"
      /><CircleCheck v-else :size="22" /><view class="layout-grow"
        ><text class="overview-person-name">{{ t(item.name) }}</text
        ><text class="gallery-description">{{ t(item.date) }}</text></view
      ><text class="layout-value">{{ t(item.amount) }}</text></view
    >
    <wd-divider /><view class="layout-between"
      ><text class="gallery-description">{{ t('This month') }}</text
      ><wd-tag type="success" variant="light">+$1,173.00</wd-tag></view
    >
    <wd-button
      block
      variant="plain"
      @click="toast.show('You are viewing local example transactions.')"
      >{{ t('View all transactions') }}</wd-button
    >
  </GallerySection>
  <GallerySection
    :title="t('Payment method')"
    :description="t('A familiar checkout, in your colors.')"
  >
    <wd-tabs v-model="paymentRef"
      ><wd-tab :title="t('Card')"
        ><view class="gallery-surface"
          ><CreditCard :size="28" /><text class="overview-person-name">{{
            t('Visa ending in 4242')
          }}</text
          ><text class="gallery-description">{{ t('Expires 12 / 2028') }}</text></view
        ></wd-tab
      ><wd-tab :title="t('Transfer')"
        ><view class="gallery-surface"
          ><text class="overview-person-name">{{ t('Bank transfer') }}</text
          ><text class="gallery-description">{{
            t('Choose your connected account at checkout.')
          }}</text></view
        ></wd-tab
      ></wd-tabs
    >
    <wd-button
      block
      variant="plain"
      @click="toast.show('No payment details are stored in this preview.')"
      >{{ t('Manage payment method') }}</wd-button
    >
  </GallerySection>
  <GallerySection :title="t('The everyday notebook')" :description="t('For ideas worth keeping.')">
    <view class="product-art"><Pencil :size="64" /></view>
    <view class="layout-between"
      ><view
        ><text class="overview-person-name">{{ t('Studio collection') }}</text
        ><text class="gallery-description">{{ t('Soft cover · 160 pages') }}</text></view
      ><text class="layout-value">$48.00</text></view
    >
    <view class="gallery-inline"
      ><wd-tag type="success" variant="light">{{ t('In stock') }}</wd-tag
      ><wd-tag variant="plain">{{ t('Free shipping') }}</wd-tag></view
    >
    <wd-button block @click="toast.success('Notebook added to the local demo cart.')">{{
      t('Add to bag')
    }}</wd-button>
  </GallerySection>
  <GallerySection
    :title="t('Your shopping bag')"
    :description="t('A few things to make your day.')"
  >
    <view class="overview-person"
      ><Gift :size="28" /><view class="layout-grow"
        ><text class="overview-person-name">{{ t('Everyday notebook') }}</text
        ><text class="gallery-description">{{ t('$48.00 each') }}</text></view
      ><wd-input-number v-model="quantityRef" :min="1" :max="10"
    /></view>
    <wd-divider /><view class="layout-between"
      ><text class="gallery-description">{{ t('Subtotal') }}</text
      ><text class="layout-value">${{ t(total) }}</text></view
    >
    <view class="layout-between"
      ><text class="gallery-description">{{ t('Shipping') }}</text
      ><wd-tag type="success" variant="light">{{ t('On us') }}</wd-tag></view
    >
    <view class="layout-between"
      ><text>{{ t('Total') }}</text
      ><text class="overview-metric">${{ t(total) }}</text></view
    >
    <wd-button block @click="toast.show('Demo checkout only. No order is placed.')">{{
      t('Review order')
    }}</wd-button>
  </GallerySection>
  <GallerySection
    :title="t('On its way')"
    :description="t('Order #ST-2048 · Your studio essentials')"
  >
    <view class="layout-between"
      ><wd-tag type="primary" variant="light">{{ t('In transit') }}</wd-tag
      ><CircleCheck :size="24"
    /></view>
    <text class="overview-metric">{{ t('Arriving Friday') }}</text>
    <wd-steps :active="2" vertical
      ><wd-step :title="t('Order confirmed')" :description="t('Oct 12, 9:41 AM')" /><wd-step
        :title="t('Packed with care')"
        :description="t('Oct 13, 2:15 PM')" /><wd-step
        :title="t('Out for delivery')"
        :description="t('Your package is almost there')" /><wd-step :title="t('Delivered')"
    /></wd-steps>
    <wd-button
      block
      variant="plain"
      @click="toast.show('Your demo package is right on schedule.')"
      >{{ t('Track package') }}</wd-button
    >
  </GallerySection>
</template>

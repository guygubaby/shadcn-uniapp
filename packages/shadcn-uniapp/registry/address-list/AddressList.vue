<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, ref } from 'vue'
import { MapPin, Pencil, Plus } from '@lucide/vue'
type Address = {
  id: string
  name: string
  phone: string
  address: string
  label?: string
  isDefault?: boolean
}
const props = defineProps<{ addresses: Address[]; selectedId?: string }>()
const emit = defineEmits<{ select: [address: Address]; edit: [id: string]; add: [] }>()
const selectedRef = ref(
  props.selectedId ??
    props.addresses.find((address) => address.isDefault)?.id ??
    props.addresses[0]?.id ??
    '',
)
const selected = computed(() => props.addresses.find((address) => address.id === selectedRef.value))
</script>

<template>
  <view class="flex flex-col gap-5 py-2">
    <view
      ><text class="block text-2xl font-semibold">{{ t('Shipping addresses') }}</text
      ><text class="mt-2 block text-sm leading-6 text-[var(--sui-muted-foreground)]">{{
        t('Choose where your next delivery goes.')
      }}</text></view
    >
    <wd-radio-group v-model="selectedRef" class="flex flex-col gap-4">
      <view
        v-for="address in addresses"
        :key="address.id"
        class="rounded-xl border border-solid p-4"
        :class="
          selectedRef === address.id
            ? 'border-[var(--sui-primary)] bg-[var(--sui-muted)]'
            : 'border-[var(--sui-border)]'
        "
      >
        <wd-radio :value="address.id"
          ><view class="min-w-0"
            ><view class="flex flex-wrap items-center gap-2"
              ><text class="font-semibold">{{ address.name }}</text
              ><text class="text-sm text-[var(--sui-muted-foreground)]">{{
                address.phone
              }}</text></view
            ><text class="mt-2 block text-sm leading-6">{{ t(address.address) }}</text></view
          ></wd-radio
        >
        <view class="mt-3 flex items-center justify-between gap-2"
          ><view class="flex flex-wrap gap-2"
            ><wd-tag v-if="address.isDefault" variant="light">{{ t('Default') }}</wd-tag
            ><wd-tag v-if="address.label" variant="plain">{{ t(address.label) }}</wd-tag></view
          ><wd-button size="small" variant="text" @click="emit('edit', address.id)"
            ><view class="flex items-center gap-1"
              ><Pencil :size="14" />{{ t('Edit') }}</view
            ></wd-button
          ></view
        >
      </view>
    </wd-radio-group>
    <view
      v-if="!addresses.length"
      class="flex flex-col items-center gap-3 py-10 text-[var(--sui-muted-foreground)]"
      ><MapPin :size="36" /><text>{{ t('No saved addresses yet') }}</text></view
    >
    <wd-button block variant="plain" @click="emit('add')"
      ><view class="flex items-center justify-center gap-2"
        ><Plus :size="18" />{{ t('Add a new address') }}</view
      ></wd-button
    >
    <wd-button block :disabled="!selected" @click="selected && emit('select', selected)">{{
      t('Deliver here')
    }}</wd-button>
  </view>
</template>

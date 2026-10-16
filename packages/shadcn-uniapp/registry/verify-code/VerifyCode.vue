<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, onUnmounted, ref, watch } from 'vue'
import { Smartphone, ShieldCheck } from '@lucide/vue'
import type { FormSchema } from '@wot-ui/ui'
import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'

const props = defineProps<{
  destination: string
  loading?: boolean
  resending?: boolean
  resendAt?: number
}>()
const emit = defineEmits<{ verify: [code: string]; resend: []; changeNumber: [] }>()
const codeRef = ref('')
const remainingRef = ref(0)
const formRef = ref<FormInstance>()
const model = computed(() => ({ code: codeRef.value }))
let timer: ReturnType<typeof setInterval> | undefined
watch(
  () => props.resendAt,
  (timestamp) => {
    clearInterval(timer)
    const update = () => {
      remainingRef.value = Math.max(0, Math.ceil(((timestamp ?? 0) - Date.now()) / 1000))
    }
    update()
    if (remainingRef.value)
      timer = setInterval(() => {
        update()
        if (!remainingRef.value) clearInterval(timer)
      }, 1000)
  },
  { immediate: true },
)
onUnmounted(() => clearInterval(timer))
const schema: FormSchema = {
  validate: (value) =>
    /^\d{6}$/.test(String(value.code))
      ? []
      : [{ path: ['code'], message: t('Enter the 6-digit code') }],
  isRequired: () => true,
}
async function verify() {
  if (props.loading) return
  if ((await formRef.value?.validate())?.valid) emit('verify', codeRef.value)
}
</script>

<template>
  <view class="flex flex-col gap-6 py-3">
    <view
      ><view class="mb-6 inline-flex rounded-2xl bg-[var(--sui-muted)] p-4"
        ><Smartphone :size="32" /></view
      ><text class="block text-3xl font-semibold tracking-tight">{{ t('Check your phone') }}</text
      ><text class="mt-3 block text-sm leading-6 text-[var(--sui-muted-foreground)]">{{
        t('Enter the verification code sent to')
      }}</text
      ><text class="mt-1 block font-medium">{{ destination }}</text></view
    >
    <wd-form ref="formRef" :model="model" :schema="schema" layout="vertical"
      ><wd-form-item :title="t('Verification code')" prop="code"
        ><wd-input
          v-model="codeRef"
          type="number"
          inputmode="numeric"
          :maxlength="6"
          placeholder="000000"
          custom-input-class="text-center text-2xl tracking-widest"
          @confirm="verify" /></wd-form-item
    ></wd-form>
    <wd-button block :loading="loading" :disabled="loading" @click="verify">{{
      t('Verify and continue')
    }}</wd-button>
    <view
      class="flex flex-wrap items-center justify-center gap-1 text-sm text-[var(--sui-muted-foreground)]"
      ><text>{{ t('Did not receive a code?') }}</text
      ><wd-button
        size="small"
        variant="text"
        :loading="resending"
        :disabled="remainingRef > 0 || resending"
        @click="emit('resend')"
        >{{ remainingRef > 0 ? `${t('Resend in')} ${remainingRef}s` : t('Resend code') }}</wd-button
      ></view
    >
    <wd-button variant="plain" block @click="emit('changeNumber')">{{
      t('Use a different number')
    }}</wd-button>
    <view class="flex items-center justify-center gap-2 text-xs text-[var(--sui-muted-foreground)]"
      ><ShieldCheck :size="16" /><text>{{ t('Never share this code with anyone.') }}</text></view
    >
  </view>
</template>

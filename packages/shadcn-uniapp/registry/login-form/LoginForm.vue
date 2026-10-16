<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, ref } from 'vue'
import { ArrowRight, Mail, LockKeyhole, MessageCircle, ShieldCheck } from '@lucide/vue'
import type { FormSchema } from '@wot-ui/ui'
import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'
const props = defineProps<{ email?: string; loading?: boolean }>()
const emit = defineEmits<{
  submit: [value: { email: string; password: string }]
  wechat: []
  forgotPassword: []
  terms: []
  privacy: []
}>()
const modeRef = ref<'wechat' | 'password'>('wechat')
const emailRef = ref(props.email ?? '')
const passwordRef = ref('')
const agreedRef = ref(false)
const formRef = ref<FormInstance>()
const model = computed(() => ({
  email: emailRef.value,
  password: passwordRef.value,
  agreed: agreedRef.value,
}))
const schema: FormSchema = {
  validate(value) {
    const issues = []
    if (modeRef.value === 'password') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value.email).trim()))
        issues.push({ path: ['email'], message: t('Enter a valid email address') })
      if (!value.password) issues.push({ path: ['password'], message: t('Enter your password') })
    }
    if (!value.agreed)
      issues.push({ path: ['agreed'], message: t('Please accept the terms to continue') })
    return issues
  },
  isRequired: () => true,
}
function switchMode() {
  modeRef.value = modeRef.value === 'wechat' ? 'password' : 'wechat'
  formRef.value?.reset()
}
async function submit() {
  if (props.loading || !(await formRef.value?.validate())?.valid) return
  if (modeRef.value === 'wechat') emit('wechat')
  else emit('submit', { email: emailRef.value.trim(), password: passwordRef.value })
}
</script>
<template>
  <view class="flex flex-col gap-5">
    <view class="py-6 text-center">
      <view class="mb-6 inline-flex rounded-3xl bg-[var(--sui-muted)] p-5"
        ><MessageCircle v-if="modeRef === 'wechat'" :size="44" /><ShieldCheck v-else :size="44"
      /></view>
      <text class="block text-3xl font-semibold tracking-tight">{{ t('Welcome back') }}</text>
      <text class="mt-3 block text-sm leading-6 text-[var(--sui-muted-foreground)]">{{
        t(
          modeRef === 'wechat'
            ? 'Use WeChat to sign in. No password to remember.'
            : 'Sign in with your account and password.',
        )
      }}</text>
    </view>
    <wd-form ref="formRef" :model="model" :schema="schema" :disabled="loading" layout="vertical">
      <template v-if="modeRef === 'password'">
        <wd-form-item :title="t('Email address')" prop="email"
          ><wd-input
            v-model="emailRef"
            inputmode="email"
            :placeholder="t('you@example.com')"
            confirm-type="next"
            ><template #prefix><Mail :size="18" /></template></wd-input
        ></wd-form-item>
        <wd-form-item :title="t('Password')" prop="password"
          ><wd-input
            v-model="passwordRef"
            show-password
            :placeholder="t('Enter your password')"
            @confirm="submit"
            ><template #prefix><LockKeyhole :size="18" /></template></wd-input
        ></wd-form-item>
      </template>
      <wd-form-item prop="agreed"
        ><wd-checkbox v-model="agreedRef">{{
          t('I agree to the terms and privacy policy')
        }}</wd-checkbox></wd-form-item
      >
    </wd-form>
    <view class="flex flex-wrap justify-center gap-2"
      ><wd-button variant="text" size="small" @click="emit('terms')">{{
        t('Terms of service')
      }}</wd-button
      ><wd-button variant="text" size="small" @click="emit('privacy')">{{
        t('Privacy policy')
      }}</wd-button></view
    >
    <wd-button block :loading="loading" :disabled="loading" @click="submit"
      ><view class="flex items-center justify-center gap-2"
        ><MessageCircle v-if="modeRef === 'wechat'" :size="20" /><text>{{
          t(modeRef === 'wechat' ? 'WeChat one-tap sign in' : 'Sign in')
        }}</text
        ><ArrowRight v-if="modeRef === 'password'" :size="18" /></view
    ></wd-button>
    <wd-button block variant="plain" :disabled="loading" @click="switchMode">{{
      t(modeRef === 'wechat' ? 'Use account and password' : 'Use WeChat sign-in')
    }}</wd-button>
    <view v-if="modeRef === 'password'" class="flex justify-center"
      ><wd-button variant="text" size="small" @click="emit('forgotPassword')">{{
        t('Forgot password?')
      }}</wd-button></view
    >
  </view>
</template>

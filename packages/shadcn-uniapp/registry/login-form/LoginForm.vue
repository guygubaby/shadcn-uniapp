<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, ref } from 'vue'
import type { FormSchema } from '@wot-ui/ui'
import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'
const props = defineProps<{ email?: string; loading?: boolean }>()
const emit = defineEmits<{ submit: [value: { email: string }] }>()
const emailRef = ref(props.email ?? '')
const formRef = ref<FormInstance>()
const model = computed(() => ({ email: emailRef.value }))
const schema: FormSchema = {
  validate(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value as { email: string }).email.trim())
      ? []
      : [{ path: ['email'], message: t('Enter a valid email address') }]
  },
  isRequired: () => true,
}
async function submit() {
  if ((await formRef.value?.validate())?.valid) emit('submit', { email: emailRef.value.trim() })
}
</script>
<template>
  <wd-form ref="formRef" :model="model" :schema="schema">
    <wd-form-item :title="t('Email address')" prop="email"
      ><wd-input v-model="emailRef" :placeholder="t('you@example.com')" clearable
    /></wd-form-item>
  </wd-form>
  <wd-button block :loading="loading" :disabled="loading" @click="submit">{{
    t('Continue with email')
  }}</wd-button>
  <wd-divider />
  <wd-text
    :text="t('Use your email to continue to your workspace.')"
    color="var(--sui-muted-foreground)"
  />
</template>

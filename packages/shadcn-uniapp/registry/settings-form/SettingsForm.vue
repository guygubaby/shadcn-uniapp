<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FormSchema } from '@wot-ui/ui'
import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'

const props = defineProps<{ email?: string; notifications?: boolean; loading?: boolean }>()
const emit = defineEmits<{ save: [value: { email: string; notifications: boolean }] }>()
const emailRef = ref(props.email ?? '')
const notificationsRef = ref(props.notifications ?? true)
const formRef = ref<FormInstance>()
const model = computed(() => ({ email: emailRef.value, notifications: notificationsRef.value }))
const schema: FormSchema = {
  validate(value) {
    const email = (value as { email: string }).email.trim()
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? []
      : [{ path: ['email'], message: 'Enter a valid email address' }]
  },
  isRequired: (path) => path === 'email',
}

async function save() {
  const result = await formRef.value?.validate()
  if (result?.valid)
    emit('save', { email: emailRef.value.trim(), notifications: notificationsRef.value })
}
</script>

<template>
  <wd-form ref="formRef" :model="model" :schema="schema">
    <wd-form-item title="Email" prop="email">
      <wd-input v-model="emailRef" placeholder="you@example.com" />
    </wd-form-item>
    <wd-form-item title="Email notifications" prop="notifications">
      <wd-switch v-model="notificationsRef" />
    </wd-form-item>
  </wd-form>
  <wd-button type="primary" block :loading="loading" :disabled="loading" @click="save"
    >Save preferences</wd-button
  >
</template>

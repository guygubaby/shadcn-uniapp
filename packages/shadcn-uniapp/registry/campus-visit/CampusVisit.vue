<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, ref } from 'vue'
import { GraduationCap, MapPin, Clock, Users } from '@lucide/vue'
import type { FormSchema } from '@wot-ui/ui'
import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'

const props = defineProps<{
  school: string
  sessions: { id: string; campus: string; date: string; time: string; available: boolean }[]
  loading?: boolean
}>()
const emit = defineEmits<{
  reserve: [value: { sessionId: string; parentName: string; email: string; guests: number }]
  contact: []
}>()
const sessionRef = ref(props.sessions.find((session) => session.available)?.id ?? '')
const parentNameRef = ref('')
const emailRef = ref('')
const guestsRef = ref(2)
const formRef = ref<FormInstance>()
const selected = computed(() => props.sessions.find((session) => session.id === sessionRef.value))
const model = computed(() => ({
  parentName: parentNameRef.value,
  email: emailRef.value,
  session: sessionRef.value,
}))
const schema: FormSchema = {
  validate(value) {
    const issues = []
    if (!String(value.parentName).trim())
      issues.push({ path: ['parentName'], message: t('Enter the parent or guardian name') })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value.email).trim()))
      issues.push({ path: ['email'], message: t('Enter a valid email address') })
    if (!props.sessions.some((session) => session.id === value.session && session.available))
      issues.push({ path: ['session'], message: t('Choose an available visit') })
    return issues
  },
  isRequired: () => true,
}
async function reserve() {
  if (props.loading) return
  if ((await formRef.value?.validate())?.valid)
    emit('reserve', {
      sessionId: sessionRef.value,
      parentName: parentNameRef.value.trim(),
      email: emailRef.value.trim(),
      guests: guestsRef.value,
    })
}
</script>

<template>
  <view class="flex flex-col gap-5 py-2">
    <view class="rounded-2xl bg-[var(--sui-muted)] p-5"
      ><GraduationCap :size="30" /><text
        class="mt-4 block text-xs text-[var(--sui-muted-foreground)]"
        >{{ t(school) }}</text
      ><text class="mt-1 block text-2xl font-semibold">{{ t('Come see school life') }}</text
      ><text class="mt-3 block text-sm leading-6">{{
        t('Meet our teachers, explore the campus, and find your family’s next chapter.')
      }}</text
      ><view class="mt-4 flex flex-wrap gap-4 text-xs text-[var(--sui-muted-foreground)]"
        ><view class="flex items-center gap-1"
          ><Clock :size="14" />{{ t('60-minute guided tour') }}</view
        ><view class="flex items-center gap-1"
          ><Users :size="14" />{{ t('Families welcome') }}</view
        ></view
      ></view
    >
    <wd-form ref="formRef" :model="model" :schema="schema" layout="vertical">
      <wd-form-item :title="t('Choose your visit')" prop="session"
        ><wd-radio-group v-model="sessionRef" class="flex flex-col gap-3"
          ><wd-radio
            v-for="session in sessions"
            :key="session.id"
            :value="session.id"
            :disabled="!session.available"
            ><view
              ><text class="block text-sm font-medium"
                >{{ t(session.date) }} · {{ session.time }}</text
              ><view class="mt-1 flex items-center gap-1 text-xs text-[var(--sui-muted-foreground)]"
                ><MapPin :size="13" /><text
                  >{{ t(session.campus)
                  }}{{ session.available ? '' : ` · ${t('Fully booked')}` }}</text
                ></view
              ></view
            ></wd-radio
          ></wd-radio-group
        ></wd-form-item
      >
      <wd-form-item :title="t('Parent / guardian')" prop="parentName"
        ><wd-input v-model="parentNameRef" :placeholder="t('Your name')"
      /></wd-form-item>
      <wd-form-item :title="t('Email address')" prop="email"
        ><wd-input v-model="emailRef" inputmode="email" :placeholder="t('you@example.com')"
      /></wd-form-item>
    </wd-form>
    <wd-cell :title="t('Visitors')" :label="t('Including children')" center
      ><wd-input-number v-model="guestsRef" :min="1" :max="6"
    /></wd-cell>
    <wd-button
      block
      :loading="loading"
      :disabled="!selected?.available || loading"
      @click="reserve"
      >{{ t('Book a campus visit') }}</wd-button
    >
    <wd-button block size="small" variant="text" @click="emit('contact')">{{
      t('Have a question? Contact admissions')
    }}</wd-button>
  </view>
</template>

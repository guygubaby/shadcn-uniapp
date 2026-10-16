<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, ref, shallowRef } from 'vue'
import { CalendarDays, Info, Send } from '@lucide/vue'
import type { FormSchema } from '@wot-ui/ui'
import type { FormInstance } from '@wot-ui/ui/components/wd-form/types'
import type { CalendarInstance } from '@wot-ui/ui/components/wd-calendar/types'

const props = defineProps<{
  students: { id: string; name: string; grade: string; initials: string }[]
  minDate: number
  maxDate: number
  loading?: boolean
}>()
const emit = defineEmits<{
  submit: [
    value: { studentId: string; type: string; startDate: number; endDate: number; reason: string },
  ]
}>()
const studentRef = ref(props.students[0]?.id ?? '')
const typeRef = ref('sick')
const rangeRef = shallowRef<number | number[] | null>(null)
const reasonRef = ref('')
const calendarRef = ref<CalendarInstance>()
const formRef = ref<FormInstance>()
const selected = computed(() => props.students.find((student) => student.id === studentRef.value))
const model = computed(() => ({
  student: studentRef.value,
  range: rangeRef.value,
  reason: reasonRef.value,
}))
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
}
const dateLabel = computed(() =>
  Array.isArray(rangeRef.value) && rangeRef.value.length === 2
    ? rangeRef.value.map(formatDate).join(' – ')
    : t('Select dates'),
)
const schema: FormSchema = {
  validate(value) {
    const issues = []
    if (!props.students.some((student) => student.id === value.student))
      issues.push({ path: ['student'], message: t('Choose a student') })
    const range = value.range
    if (
      !Array.isArray(range) ||
      range.length !== 2 ||
      !range.every(Number.isFinite) ||
      range[0] > range[1] ||
      range[0] < props.minDate ||
      range[1] > props.maxDate
    )
      issues.push({ path: ['range'], message: t('Choose a valid absence date range') })
    if (!String(value.reason).trim())
      issues.push({ path: ['reason'], message: t('Tell the school the reason for absence') })
    return issues
  },
  isRequired: () => true,
}
async function submit() {
  if (props.loading) return
  if ((await formRef.value?.validate())?.valid && Array.isArray(rangeRef.value))
    emit('submit', {
      studentId: studentRef.value,
      type: typeRef.value,
      startDate: rangeRef.value[0]!,
      endDate: rangeRef.value[1]!,
      reason: reasonRef.value.trim(),
    })
}
</script>

<template>
  <view class="flex flex-col gap-5 py-2">
    <view
      ><text class="block text-2xl font-semibold">{{ t('Report an absence') }}</text
      ><text class="mt-2 block text-sm leading-6 text-[var(--sui-muted-foreground)]">{{
        t('Let the homeroom team know before the school day begins.')
      }}</text></view
    >
    <view v-if="selected" class="flex items-center gap-3 rounded-xl bg-[var(--sui-muted)] p-4"
      ><wd-avatar :text="selected.initials" :size="44" /><view
        ><text class="block font-semibold">{{ selected.name }}</text
        ><text class="mt-1 block text-xs text-[var(--sui-muted-foreground)]">{{
          t(selected.grade)
        }}</text></view
      ></view
    >
    <wd-form ref="formRef" :model="model" :schema="schema" layout="vertical">
      <wd-form-item v-if="students.length > 1" :title="t('Student')" prop="student"
        ><wd-radio-group v-model="studentRef" class="sui-choice-group"
          ><wd-radio v-for="student in students" :key="student.id" :value="student.id">{{
            student.name
          }}</wd-radio></wd-radio-group
        ></wd-form-item
      >
      <wd-form-item :title="t('Absence type')"
        ><wd-radio-group v-model="typeRef" class="sui-choice-group"
          ><wd-radio value="sick">{{ t('Sick leave') }}</wd-radio
          ><wd-radio value="personal">{{ t('Personal leave') }}</wd-radio></wd-radio-group
        ></wd-form-item
      >
      <wd-form-item :title="t('Absence dates')" prop="range"
        ><wd-button block variant="plain" @click="calendarRef?.open()"
          ><view class="flex items-center justify-center gap-2"
            ><CalendarDays :size="18" />{{ dateLabel }}</view
          ></wd-button
        ></wd-form-item
      >
      <wd-form-item :title="t('Reason for absence')" prop="reason"
        ><wd-textarea
          v-model="reasonRef"
          :maxlength="300"
          show-word-limit
          :placeholder="t('Include anything the homeroom teacher should know.')"
      /></wd-form-item>
    </wd-form>
    <view
      class="flex items-start gap-2 rounded-xl bg-[var(--sui-muted)] p-4 text-xs leading-5 text-[var(--sui-muted-foreground)]"
      ><Info class="mt-0.5 shrink-0" :size="16" /><text>{{
        t('Your request will be shared with the homeroom teacher and attendance office.')
      }}</text></view
    >
    <wd-button block :loading="loading" :disabled="!students.length || loading" @click="submit"
      ><view class="flex items-center justify-center gap-2"
        ><Send :size="17" />{{ t('Send absence request') }}</view
      ></wd-button
    >
    <wd-calendar
      ref="calendarRef"
      v-model="rangeRef"
      type="daterange"
      :min-date="minDate"
      :max-date="maxDate"
      allow-same-day
      :title="t('Absence dates')"
      root-portal
    />
  </view>
</template>

<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, ref, shallowRef } from 'vue'
import { ClipboardCheck, Search, CheckCheck } from '@lucide/vue'
type AttendanceStatus = 'present' | 'late' | 'absent'
const props = defineProps<{
  className: string
  date: string
  students: { id: string; name: string; initials: string; status?: AttendanceStatus }[]
  loading?: boolean
}>()
const emit = defineEmits<{
  save: [
    value: {
      className: string
      date: string
      attendance: { id: string; status: AttendanceStatus }[]
    },
  ]
}>()
const searchRef = ref('')
const statusesRef = shallowRef<Record<string, AttendanceStatus | undefined>>(
  Object.fromEntries(props.students.map((student) => [student.id, student.status])),
)
const filtered = computed(() =>
  props.students.filter((student) =>
    student.name.toLowerCase().includes(searchRef.value.trim().toLowerCase()),
  ),
)
const counts = computed(() => ({
  present: props.students.filter((student) => statusesRef.value[student.id] === 'present').length,
  late: props.students.filter((student) => statusesRef.value[student.id] === 'late').length,
  absent: props.students.filter((student) => statusesRef.value[student.id] === 'absent').length,
  unmarked: props.students.filter((student) => !statusesRef.value[student.id]).length,
}))
function mark(id: string, status: AttendanceStatus) {
  if (!props.loading) statusesRef.value = { ...statusesRef.value, [id]: status }
}
function markRemaining() {
  if (!props.loading)
    statusesRef.value = Object.fromEntries(
      props.students.map((student) => [student.id, statusesRef.value[student.id] ?? 'present']),
    )
}
function save() {
  if (!props.students.length || counts.value.unmarked || props.loading) return
  emit('save', {
    className: props.className,
    date: props.date,
    attendance: props.students.map((student) => ({
      id: student.id,
      status: statusesRef.value[student.id]!,
    })),
  })
}
</script>

<template>
  <view class="flex flex-col gap-5 py-2">
    <view class="flex items-start justify-between gap-3"
      ><view
        ><text class="block text-2xl font-semibold">{{ t('Class attendance') }}</text
        ><text class="mt-2 block text-sm text-[var(--sui-muted-foreground)]"
          >{{ t(className) }} · {{ t(date) }}</text
        ></view
      ><ClipboardCheck :size="28"
    /></view>
    <view class="grid grid-cols-3 gap-3 rounded-xl bg-[var(--sui-muted)] p-4 text-center"
      ><view
        ><text class="block text-xl font-semibold">{{ counts.present }}</text
        ><text class="mt-1 block text-xs">{{ t('Present') }}</text></view
      ><view
        ><text class="block text-xl font-semibold">{{ counts.late }}</text
        ><text class="mt-1 block text-xs">{{ t('Late') }}</text></view
      ><view
        ><text class="block text-xl font-semibold">{{ counts.absent }}</text
        ><text class="mt-1 block text-xs">{{ t('Absent') }}</text></view
      ></view
    >
    <wd-input v-model="searchRef" :placeholder="t('Find a student')"
      ><template #prefix><Search :size="18" /></template
    ></wd-input>
    <view class="flex flex-wrap items-center justify-between gap-2"
      ><text class="text-xs text-[var(--sui-muted-foreground)]"
        >{{ t('Unmarked') }}: {{ counts.unmarked }}</text
      ><wd-button
        variant="text"
        size="small"
        :disabled="loading || !counts.unmarked"
        @click="markRemaining"
        ><view class="flex items-center gap-1"
          ><CheckCheck :size="16" />{{ t('Mark remaining present') }}</view
        ></wd-button
      ></view
    >
    <view class="flex flex-col gap-4"
      ><view
        v-for="student in filtered"
        :key="student.id"
        class="border-0 border-b border-solid border-[var(--sui-border)] pb-4"
        ><view class="mb-3 flex items-center gap-3"
          ><wd-avatar :text="student.initials" :size="36" /><text class="text-sm font-medium">{{
            student.name
          }}</text></view
        ><view class="flex flex-wrap gap-2"
          ><wd-button
            size="small"
            :variant="statusesRef[student.id] === 'present' ? 'base' : 'plain'"
            :disabled="loading"
            :aria-pressed="statusesRef[student.id] === 'present'"
            @click="mark(student.id, 'present')"
            >{{ t('Present') }}</wd-button
          ><wd-button
            size="small"
            :variant="statusesRef[student.id] === 'late' ? 'base' : 'plain'"
            :disabled="loading"
            :aria-pressed="statusesRef[student.id] === 'late'"
            @click="mark(student.id, 'late')"
            >{{ t('Late') }}</wd-button
          ><wd-button
            size="small"
            :variant="statusesRef[student.id] === 'absent' ? 'base' : 'plain'"
            :disabled="loading"
            :aria-pressed="statusesRef[student.id] === 'absent'"
            @click="mark(student.id, 'absent')"
            >{{ t('Absent') }}</wd-button
          ></view
        ></view
      ><text
        v-if="!filtered.length"
        class="py-5 text-center text-sm text-[var(--sui-muted-foreground)]"
        >{{ t('No students match your search') }}</text
      ></view
    >
    <wd-button
      block
      :loading="loading"
      :disabled="loading || !students.length || counts.unmarked > 0"
      @click="save"
      >{{ t('Save attendance') }}</wd-button
    >
  </view>
</template>

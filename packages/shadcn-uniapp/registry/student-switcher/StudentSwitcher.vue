<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, ref } from 'vue'
const props = defineProps<{
  students: { id: string; name: string; initials: string; grade: string; campus: string }[]
}>()
const emit = defineEmits<{ select: [id: string] }>()
const selectedRef = ref(props.students[0]?.id ?? '')
const popupRef = ref(false)
const selected = computed(() => props.students.find((student) => student.id === selectedRef.value))
function select(id: string) {
  selectedRef.value = id
  popupRef.value = false
  emit('select', id)
}
</script>
<template>
  <view v-if="selected" style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px"
    ><wd-avatar :text="t(selected.initials)" :size="52" /><view
      ><text style="display: block; font-size: 18px; font-weight: 600">{{ t(selected.name) }}</text
      ><wd-text
        :text="t(`${t(selected.grade)} · ${t(selected.campus)}`)"
        color="var(--sui-muted-foreground)" /></view
  ></view>
  <wd-button block variant="plain" :disabled="!students.length" @click="popupRef = true">{{
    t('Switch student')
  }}</wd-button>
  <wd-popup v-model="popupRef" position="bottom" round root-portal>
    <view style="padding: 24px"
      ><text style="display: block; margin-bottom: 16px; font-size: 18px; font-weight: 600">{{
        t('Choose a student')
      }}</text>
      <wd-cell
        v-for="student in students"
        :key="student.id"
        :title="t(student.name)"
        :label="t(`${t(student.grade)} · ${t(student.campus)}`)"
        is-link
        @click="select(student.id)"
        ><wd-tag v-if="student.id === selectedRef" variant="light">{{
          t('Selected')
        }}</wd-tag></wd-cell
      >
      <wd-gap :height="16" />
      <wd-button block variant="plain" @click="popupRef = false">{{ t('Close') }}</wd-button>
    </view>
  </wd-popup>
</template>

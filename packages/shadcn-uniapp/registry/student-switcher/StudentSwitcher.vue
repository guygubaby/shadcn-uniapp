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
  <view v-if="selected" class="mb-4.5 flex items-center gap-3.5"
    ><wd-avatar :text="t(selected.initials)" :size="52" /><view
      ><text class="block text-lg font-semibold">{{ t(selected.name) }}</text
      ><wd-text
        :text="t(`${t(selected.grade)} · ${t(selected.campus)}`)"
        color="var(--sui-muted-foreground)" /></view
  ></view>
  <wd-button block variant="plain" :disabled="!students.length" @click="popupRef = true">{{
    t('Switch student')
  }}</wd-button>
  <wd-popup v-model="popupRef" position="bottom" round root-portal>
    <view class="p-6"
      ><text class="mb-4 block text-lg font-semibold">{{ t('Choose a student') }}</text>
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

<script setup lang="ts">
import { usePreviewI18n } from '../../i18n'

import { computed, ref, shallowRef } from 'vue'
import GallerySection from './GallerySection.vue'

const { t } = usePreviewI18n()
const pickerRef = shallowRef(['design'])
const multiRef = shallowRef(['design'])
const cascaderRef = ref('buttons')
const dateRef = ref(new Date(2026, 9, 15).getTime())
const options = computed(() => [
  { value: 'design', label: t('Design') },
  { value: 'engineering', label: t('Engineering') },
  { value: 'product', label: t('Product') },
])
const tree = computed(() => [
  {
    value: 'components',
    text: t('Components'),
    children: [
      { value: 'buttons', text: t('Buttons') },
      { value: 'inputs', text: t('Inputs') },
    ],
  },
  { value: 'blocks', text: t('Blocks'), children: [{ value: 'profile', text: t('Profile') }] },
])
const min = new Date(2026, 9, 1).getTime()
const max = new Date(2026, 9, 31).getTime()
</script>
<template>
  <view class="gallery-grid">
    <GallerySection
      :title="t('Popup pickers')"
      :description="t('Picker, SelectPicker, Cascader, DateTimePicker, and Calendar.')"
      ><wd-cell-group border
        ><wd-picker
          v-model="pickerRef"
          :columns="options"
          :label="t('Team')"
          :title="t('Choose your team')"
          root-portal /><wd-select-picker
          v-model="multiRef"
          :columns="options"
          :label="t('Interests')"
          :title="t('Choose your interests')"
          root-portal /><wd-cascader
          v-model="cascaderRef"
          :options="tree"
          :label="t('Category')"
          :title="t('Choose a category')"
          root-portal /><wd-datetime-picker
          v-model="dateRef"
          :label="t('Schedule')"
          :title="t('Schedule')"
          type="date"
          root-portal /><wd-calendar
          v-model="dateRef"
          :label="t('Calendar')"
          :title="t('Pick a date')"
          :min-date="min"
          :max-date="max"
          root-portal /></wd-cell-group
    ></GallerySection>
    <GallerySection :title="t('Picker view')" :description="t('An inline selection wheel.')"
      ><wd-picker-view v-model="pickerRef" :columns="options" :visible-item-count="3"
    /></GallerySection>
    <GallerySection
      :title="t('DateTimePicker view')"
      :description="t('Date input without opening an overlay.')"
      ><wd-datetime-picker-view v-model="dateRef" type="date" :visible-item-count="3"
    /></GallerySection>
    <GallerySection
      :title="t('Calendar view')"
      :description="t('A bounded date range for a deterministic fixture.')"
      ><wd-calendar-view v-model="dateRef" :min-date="min" :max-date="max" :panel-height="320"
    /></GallerySection>
  </view>
</template>

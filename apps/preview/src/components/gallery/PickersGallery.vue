<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import GallerySection from './GallerySection.vue'
const pickerRef = shallowRef(['design'])
const multiRef = shallowRef(['design'])
const cascaderRef = ref('buttons')
const dateRef = ref(new Date(2026, 9, 15).getTime())
const options = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
]
const tree = [
  {
    value: 'components',
    text: 'Components',
    children: [
      { value: 'buttons', text: 'Buttons' },
      { value: 'inputs', text: 'Inputs' },
    ],
  },
  { value: 'blocks', text: 'Blocks', children: [{ value: 'profile', text: 'Profile' }] },
]
const min = new Date(2026, 9, 1).getTime()
const max = new Date(2026, 9, 31).getTime()
</script>
<template>
  <view class="gallery-grid">
    <GallerySection
      title="Popup pickers"
      description="Picker, SelectPicker, Cascader, DateTimePicker, and Calendar."
      ><wd-cell-group border
        ><wd-picker
          v-model="pickerRef"
          :columns="options"
          label="Team"
          title="Choose your team"
          root-portal /><wd-select-picker
          v-model="multiRef"
          :columns="options"
          label="Interests"
          title="Choose your interests"
          root-portal /><wd-cascader
          v-model="cascaderRef"
          :options="tree"
          label="Category"
          title="Choose a category"
          root-portal /><wd-datetime-picker
          v-model="dateRef"
          label="Schedule"
          title="Schedule"
          type="date"
          root-portal /><wd-calendar
          v-model="dateRef"
          label="Calendar"
          title="Pick a date"
          :min-date="min"
          :max-date="max"
          root-portal /></wd-cell-group
    ></GallerySection>
    <GallerySection title="Picker view" description="An inline selection wheel."
      ><wd-picker-view v-model="pickerRef" :columns="options" :visible-item-count="3"
    /></GallerySection>
    <GallerySection title="DateTimePicker view" description="Date input without opening an overlay."
      ><wd-datetime-picker-view v-model="dateRef" type="date" :visible-item-count="3"
    /></GallerySection>
    <GallerySection
      title="Calendar view"
      description="A bounded date range for a deterministic fixture."
      ><wd-calendar-view v-model="dateRef" :min-date="min" :max-date="max" :panel-height="320"
    /></GallerySection>
  </view>
</template>

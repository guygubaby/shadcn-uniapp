<script setup lang="ts">
import { usePreviewI18n } from '../../i18n'

import { ref } from 'vue'
import BasicsGallery from './BasicsGallery.vue'
import FormsGallery from './FormsGallery.vue'
import PickersGallery from './PickersGallery.vue'
import NavigationGallery from './NavigationGallery.vue'
import DataGallery from './DataGallery.vue'
import FeedbackGallery from './FeedbackGallery.vue'

const { t } = usePreviewI18n()
const props = defineProps<{ expanded?: boolean }>()
const categoryRef = ref('all')
const categories = [
  { value: 'all', label: 'All components' },
  { value: 'basics', label: 'Basics' },
  { value: 'forms', label: 'Forms' },
  { value: 'pickers', label: 'Pickers' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'data', label: 'Data' },
  { value: 'feedback', label: 'Feedback' },
]
</script>
<template>
  <view class="catalog-heading"
    ><text class="catalog-title">{{ t('Every piece, in your theme.') }}</text
    ><text class="gallery-description">{{
      t('100 Wot UI components. One design language. Every example follows your theme.')
    }}</text></view
  >
  <view v-if="!props.expanded" class="catalog-navigation"
    ><wd-button
      v-for="category in categories"
      :key="category.value"
      size="small"
      :variant="categoryRef === category.value ? 'base' : 'plain'"
      @click="categoryRef = category.value"
      >{{ t(category.label) }}</wd-button
    ></view
  >
  <BasicsGallery v-if="props.expanded || categoryRef === 'all' || categoryRef === 'basics'" />
  <FormsGallery v-if="props.expanded || categoryRef === 'all' || categoryRef === 'forms'" />
  <PickersGallery v-if="props.expanded || categoryRef === 'all' || categoryRef === 'pickers'" />
  <NavigationGallery
    v-if="props.expanded || categoryRef === 'all' || categoryRef === 'navigation'"
  />
  <DataGallery v-if="props.expanded || categoryRef === 'all' || categoryRef === 'data'" />
  <FeedbackGallery v-if="props.expanded || categoryRef === 'all' || categoryRef === 'feedback'" />
</template>

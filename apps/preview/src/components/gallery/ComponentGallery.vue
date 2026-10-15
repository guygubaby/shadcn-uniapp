<script setup lang="ts">
import { ref } from 'vue'
import BasicsGallery from './BasicsGallery.vue'
import FormsGallery from './FormsGallery.vue'
import PickersGallery from './PickersGallery.vue'
import NavigationGallery from './NavigationGallery.vue'
import DataGallery from './DataGallery.vue'
import FeedbackGallery from './FeedbackGallery.vue'
const categoryRef = ref('basics')
const categories = [
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
    ><text class="catalog-title">Every piece, in your theme.</text
    ><text class="gallery-description"
      >Interactive Wot UI v2 fixtures. Local data only. Media, canvas, and gestures still need
      device testing.</text
    ></view
  >
  <view class="catalog-navigation"
    ><wd-button
      v-for="category in categories"
      :key="category.value"
      size="small"
      :variant="categoryRef === category.value ? 'base' : 'plain'"
      @click="categoryRef = category.value"
      >{{ category.label }}</wd-button
    ></view
  >
  <BasicsGallery v-if="categoryRef === 'basics'" /><FormsGallery
    v-else-if="categoryRef === 'forms'"
  /><PickersGallery v-else-if="categoryRef === 'pickers'" /><NavigationGallery
    v-else-if="categoryRef === 'navigation'"
  /><DataGallery v-else-if="categoryRef === 'data'" /><FeedbackGallery v-else />
</template>

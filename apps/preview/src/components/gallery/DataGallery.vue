<script setup lang="ts">
import image from '../../static/preview-cover.png'
import { ref, shallowRef } from 'vue'
import GallerySection from './GallerySection.vue'
const collapseRef = shallowRef(['theme'])
const currentRef = ref(0)
const rows = [
  { name: 'Design system', status: 'Active', owner: 'Alex' },
  { name: 'Mobile app', status: 'In review', owner: 'Sam' },
  { name: 'Components', status: 'Done', owner: 'Jordan' },
]

const noticeRef = ref('')
</script>
<template>
  <view class="gallery-grid">
    <GallerySection title="Table" description="Table and TableColumn with local data."
      ><wd-table :data="rows" :height="210"
        ><wd-table-column prop="name" label="Project" :width="150" /><wd-table-column
          prop="status"
          label="Status"
          :width="110" /><wd-table-column prop="owner" label="Owner" :width="90" /></wd-table
    ></GallerySection>
    <GallerySection title="Collapse" description="Collapse and CollapseItem."
      ><wd-collapse v-model="collapseRef"
        ><wd-collapse-item name="theme" title="Can I keep my Wot components?"
          >Yes. Your component APIs stay the same.</wd-collapse-item
        ><wd-collapse-item name="source" title="Do I own the blocks?"
          >Blocks are installed as editable Vue source.</wd-collapse-item
        ></wd-collapse
      ></GallerySection
    >
    <GallerySection
      title="Swipe actions"
      description="SwipeAction and Loadmore. No backend requests."
      ><wd-swipe-action
        ><wd-cell title="Project invitation" label="Swipe left to reveal an action." /><template
          #right
          ><wd-button type="danger" @click="noticeRef = 'Demo action only. Nothing was deleted.'"
            >Dismiss</wd-button
          ></template
        ></wd-swipe-action
      ><text v-if="noticeRef" class="gallery-description" role="status">{{ noticeRef }}</text
      ><wd-loadmore state="finished" finished-text="You are all caught up"
    /></GallerySection>
    <GallerySection
      title="Images & swiper"
      description="Img, Swiper, and SwiperNav with a local image fixture."
      ><wd-img
        :src="image"
        width="100%"
        height="80px"
        custom-style="background: var(--sui-muted);" /><wd-swiper
        :list="[image, image, image]"
        :autoplay="false"
        :height="120"
        @change="currentRef = $event.current" /><wd-swiper-nav :current="currentRef" :total="3"
    /></GallerySection>
  </view>
</template>

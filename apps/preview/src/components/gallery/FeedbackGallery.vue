<script setup lang="ts">
import video from '../../static/preview-clip.mp4'
import image from '../../static/preview-cover.png'
import { ref } from 'vue'
import { useDialog, useToast, useNotify, useImagePreview, useVideoPreview } from '@wot-ui/ui'
import GallerySection from './GallerySection.vue'
const toast = useToast('gallery')
const dialog = useDialog('gallery')
const notify = useNotify('gallery')
const images = useImagePreview('gallery')
const videos = useVideoPreview('gallery')
const popupRef = ref(false)
const overlayRef = ref(false)
const sheetRef = ref(false)
const curtainRef = ref(false)
const transitionRef = ref(true)
const tourRef = ref(false)
const cropRef = ref(false)
const noticeRef = ref('')

function confirm() {
  void dialog
    .confirm({
      title: 'Keep this theme?',
      msg: 'This is a local component test. No data will be changed.',
      confirmButtonText: 'Keep theme',
      cancelButtonText: 'Cancel',
    })
    .then(() => {
      noticeRef.value = 'Theme confirmed locally.'
    })
    .catch(() => {
      noticeRef.value = 'Dialog dismissed.'
    })
}
</script>
<template>
  <view class="gallery-grid">
    <GallerySection title="Messages" description="Toast, Notify, Dialog, and NoticeBar."
      ><wd-notice-bar
        text="Your theme is ready to use."
        :scrollable="false"
        prefix="info-circle"
      /><view class="gallery-inline"
        ><wd-button variant="plain" @click="toast.success('Saved locally')">Show toast</wd-button
        ><wd-button
          variant="plain"
          @click="notify.showNotify({ message: 'Theme updated', type: 'success', duration: 1800 })"
          >Show notification</wd-button
        ><wd-button @click="confirm">Open dialog</wd-button></view
      ><text v-if="noticeRef" role="status" class="gallery-description">{{
        noticeRef
      }}</text></GallerySection
    >
    <GallerySection title="Overlays" description="Popup, RootPortal, Overlay, and ActionSheet."
      ><view class="gallery-inline"
        ><wd-button @click="popupRef = true">Open popup</wd-button
        ><wd-button variant="plain" @click="sheetRef = true">Action sheet</wd-button
        ><wd-button variant="plain" @click="overlayRef = true">Overlay</wd-button></view
      ><wd-popup v-model="popupRef" position="bottom" round root-portal
        ><view style="padding: 28px"
          ><text class="gallery-title">Your theme, everywhere</text
          ><text class="gallery-description">Detached content inherits concrete Wot tokens.</text
          ><wd-button block @click="popupRef = false">Done</wd-button></view
        ></wd-popup
      ><wd-root-portal
        ><wd-overlay :show="overlayRef" @click="overlayRef = false"
          ><view style="padding: 80px 24px; color: white; text-align: center"
            >Tap anywhere to close this overlay.</view
          ></wd-overlay
        ></wd-root-portal
      ><wd-action-sheet
        v-model="sheetRef"
        title="Share this theme"
        :actions="[{ name: 'Copy link' }, { name: 'Export JSON' }]"
        cancel-text="Cancel"
        @select="
          noticeRef = 'Demo selection only. Use the Creator export controls for real output.'
        "
    /></GallerySection>
    <GallerySection title="Context" description="Popover, Tooltip, Transition, and Tour."
      ><view class="gallery-inline"
        ><wd-popover content="Your settings stay in your browser."
          ><wd-button variant="plain">Open popover</wd-button></wd-popover
        ><wd-tooltip content="This follows your theme."
          ><wd-button variant="plain">Tooltip</wd-button></wd-tooltip
        ></view
      ><view class="gallery-inline"
        ><wd-button id="gallery-tour-target" variant="plain" @click="tourRef = true"
          >Start tour</wd-button
        ><wd-button variant="plain" @click="transitionRef = !transitionRef"
          >Toggle transition</wd-button
        ></view
      ><wd-transition :show="transitionRef" name="fade"
        ><view class="gallery-surface">A little motion, with a purpose.</view></wd-transition
      ><wd-tour
        v-model="tourRef"
        :steps="[
          { element: '#gallery-tour-target', content: 'This is a theme-aware component gallery.' },
        ]"
        next-text="Next"
        prev-text="Back"
        finish-text="Done"
        skip-text="Skip"
    /></GallerySection>
    <GallerySection
      title="Media overlays"
      description="Curtain, ImagePreview, VideoPreview, and ImgCropper."
      ><view class="gallery-inline"
        ><wd-button variant="plain" @click="curtainRef = true">Open curtain</wd-button
        ><wd-button variant="plain" @click="images.previewImage({ images: [image] })"
          >Preview image</wd-button
        ><wd-button
          variant="plain"
          @click="videos.previewVideo({ url: video, poster: image, title: 'Local demo clip' })"
          >Preview video</wd-button
        ><wd-button variant="plain" @click="cropRef = true">Crop image</wd-button></view
      ><wd-curtain v-model="curtainRef" :src="image" :width="280" root-portal /><wd-img-cropper
        v-model="cropRef"
        :img-src="image"
        cancel-button-text="Cancel"
        confirm-button-text="Confirm"
        @confirm="cropRef = false"
    /></GallerySection>
  </view>
  <wd-toast selector="gallery" /><wd-notify selector="gallery" /><wd-dialog
    selector="gallery"
  /><wd-image-preview selector="gallery" /><wd-video-preview selector="gallery" />
</template>

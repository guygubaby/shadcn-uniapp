<script setup lang="ts">
import { usePreviewI18n } from '../../i18n'

import video from '../../static/preview-clip.mp4'
import image from '../../static/preview-cover.png'
import { ref } from 'vue'
import { useDialog, useToast, useNotify, useImagePreview, useVideoPreview } from '@wot-ui/ui'
import GallerySection from './GallerySection.vue'

const { t } = usePreviewI18n()
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
    <GallerySection :title="t('Messages')" :description="t('Toast, Notify, Dialog, and NoticeBar.')"
      ><wd-notice-bar
        :text="t('Your theme is ready to use.')"
        :scrollable="false"
        prefix="info-circle"
      /><view class="gallery-inline"
        ><wd-button variant="plain" @click="toast.success('Saved locally')">{{
          t('Show toast')
        }}</wd-button
        ><wd-button
          variant="plain"
          @click="notify.showNotify({ message: 'Theme updated', type: 'success', duration: 1800 })"
          >{{ t('Show notification') }}</wd-button
        ><wd-button @click="confirm">{{ t('Open dialog') }}</wd-button></view
      ><text v-if="noticeRef" role="status" class="gallery-description">{{
        t(noticeRef)
      }}</text></GallerySection
    >
    <GallerySection
      :title="t('Overlays')"
      :description="t('Popup, RootPortal, Overlay, and ActionSheet.')"
      ><view class="gallery-inline"
        ><wd-button @click="popupRef = true">{{ t('Open popup') }}</wd-button
        ><wd-button variant="plain" @click="sheetRef = true">{{ t('Action sheet') }}</wd-button
        ><wd-button variant="plain" @click="overlayRef = true">{{ t('Overlay') }}</wd-button></view
      ><wd-popup v-model="popupRef" position="bottom" round root-portal
        ><view style="padding: 28px"
          ><text class="gallery-title">{{ t('Your theme, everywhere') }}</text
          ><text class="gallery-description">{{
            t('Detached content inherits concrete Wot tokens.')
          }}</text
          ><wd-button block @click="popupRef = false">{{ t('Done') }}</wd-button></view
        ></wd-popup
      ><wd-root-portal
        ><wd-overlay :show="overlayRef" @click="overlayRef = false"
          ><view style="padding: 80px 24px; color: white; text-align: center">{{
            t('Tap anywhere to close this overlay.')
          }}</view></wd-overlay
        ></wd-root-portal
      ><wd-action-sheet
        v-model="sheetRef"
        :title="t('Share this theme')"
        :actions="[{ name: 'Copy link' }, { name: 'Export JSON' }]"
        :cancel-text="t('Cancel')"
        @select="
          noticeRef = 'Demo selection only. Use the Creator export controls for real output.'
        "
    /></GallerySection>
    <GallerySection
      :title="t('Context')"
      :description="t('Popover, Tooltip, Transition, and Tour.')"
      ><view class="gallery-inline"
        ><wd-popover content="Your settings stay in your browser."
          ><wd-button variant="plain">{{ t('Open popover') }}</wd-button></wd-popover
        ><wd-tooltip content="This follows your theme."
          ><wd-button variant="plain">{{ t('Tooltip') }}</wd-button></wd-tooltip
        ></view
      ><view class="gallery-inline"
        ><wd-button id="gallery-tour-target" variant="plain" @click="tourRef = true">{{
          t('Start tour')
        }}</wd-button
        ><wd-button variant="plain" @click="transitionRef = !transitionRef">{{
          t('Toggle transition')
        }}</wd-button></view
      ><wd-transition :show="transitionRef" name="fade"
        ><view class="gallery-surface">{{
          t('A little motion, with a purpose.')
        }}</view></wd-transition
      ><wd-tour
        v-model="tourRef"
        :steps="[
          { element: '#gallery-tour-target', content: 'This is a theme-aware component gallery.' },
        ]"
        :next-text="t('Next')"
        :prev-text="t('Back')"
        :finish-text="t('Done')"
        :skip-text="t('Skip')"
    /></GallerySection>
    <GallerySection
      :title="t('Media overlays')"
      :description="t('Curtain, ImagePreview, VideoPreview, and ImgCropper.')"
      ><view class="gallery-inline"
        ><wd-button variant="plain" @click="curtainRef = true">{{ t('Open curtain') }}</wd-button
        ><wd-button variant="plain" @click="images.previewImage({ images: [image] })">{{
          t('Preview image')
        }}</wd-button
        ><wd-button
          variant="plain"
          @click="videos.previewVideo({ url: video, poster: image, title: 'Local demo clip' })"
          >{{ t('Preview video') }}</wd-button
        ><wd-button variant="plain" @click="cropRef = true">{{ t('Crop image') }}</wd-button></view
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

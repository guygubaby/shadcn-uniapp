<script setup lang="ts">
import { usePreviewI18n } from '../../i18n'

import { inject, ref } from 'vue'
import { previewColorsKey } from '../../theme'
import GallerySection from './GallerySection.vue'
import { CircleCheck, House, Settings, UserRound } from '@lucide/vue'

const { t } = usePreviewI18n()
const colorsRef = inject(previewColorsKey)!
const counterRef = ref(1280)
const watermarkRef = ref(false)
</script>
<template>
  <GallerySection
    :title="t('Buttons')"
    :description="t('Solid, outline, soft, loading, and disabled.')"
  >
    <view class="gallery-inline"
      ><wd-button @click="counterRef++">{{ t('Primary') }}</wd-button
      ><wd-button variant="plain">{{ t('Outline') }}</wd-button
      ><wd-button variant="soft">{{ t('Soft') }}</wd-button
      ><wd-button type="danger">{{ t('Danger') }}</wd-button
      ><wd-button loading>{{ t('Loading') }}</wd-button
      ><wd-button disabled>{{ t('Disabled') }}</wd-button
      ><wd-button variant="text">{{ t('Text action') }}</wd-button></view
    >
  </GallerySection>
  <GallerySection
    :title="t('Identity')"
    :description="t('Avatar, AvatarGroup, Badge, Icon, Tag, and Text.')"
  >
    <view class="gallery-inline"
      ><wd-badge :model-value="3"><wd-avatar :text="t('JL')" /></wd-badge
      ><wd-avatar-group :max-count="3"
        ><wd-avatar
          v-for="(name, i) in ['AB', 'CD', 'EF', 'GH']"
          :key="i"
          :text="t(name)" /></wd-avatar-group
      ><CircleCheck :size="24"
    /></view>
    <view class="gallery-inline"
      ><wd-tag type="primary">{{ t('Synced') }}</wd-tag
      ><wd-tag type="success">{{ t('Online') }}</wd-tag
      ><wd-tag type="warning" variant="plain">{{ t('Pending') }}</wd-tag
      ><wd-tag type="danger" variant="plain">{{ t('Destructive') }}</wd-tag></view
    ><wd-text :text="t('A consistent design language.')" />
  </GallerySection>
  <GallerySection
    :title="t('Progress')"
    :description="t('Progress, Circle, CountTo, CountDown, and Loading.')"
  >
    <wd-progress :percentage="72" /><view class="gallery-inline"
      ><!-- Circle does not watch layerColor; remount when the track color changes. -->
      <wd-circle
        :key="colorsRef.muted"
        :color="colorsRef.primary"
        :layer-color="colorsRef.muted"
        :model-value="72"
        :size="88"
        text="72%" /><view
        ><wd-count-to :end-val="counterRef" :duration="800" /><wd-count-down
          :time="3600000"
          format="HH:mm:ss" /></view
      ><wd-loading size="24px"
    /></view>
  </GallerySection>
  <GallerySection
    :title="t('Skeleton & empty states')"
    :description="t('Loading and no-result states are part of the interface.')"
    ><wd-skeleton :row-col="[{ width: '55%' }, { width: '100%' }, { width: '80%' }]" /><wd-empty
      :description="t('Nothing here yet')"
      :image-size="72"
  /></GallerySection>
  <GallerySection
    :title="t('Layout primitives')"
    :description="t('Row, Col, Grid, GridItem, Gap, Divider, Card, and Resize.')"
  >
    <wd-resize
      ><wd-row :gutter="8"
        ><wd-col :span="12"
          ><view class="gallery-surface">{{ t('Column one') }}</view></wd-col
        ><wd-col :span="12"
          ><view class="gallery-surface">{{ t('Column two') }}</view></wd-col
        ></wd-row
      ></wd-resize
    ><wd-gap :height="8" /><wd-divider>{{ t('Quick actions') }}</wd-divider
    ><wd-grid :column="3"
      ><wd-grid-item :text="t('Home')"
        ><template #icon><House :size="28" /></template
      ></wd-grid-item>
      <wd-grid-item :text="t('Settings')"
        ><template #icon><Settings :size="28" /></template
      ></wd-grid-item>
      <wd-grid-item :text="t('Profile')"
        ><template #icon><UserRound :size="28" /></template></wd-grid-item></wd-grid
    ><wd-card :title="t('Source-owned by design')">{{
      t('Adapt the pieces to your product.')
    }}</wd-card>
  </GallerySection>
  <GallerySection
    :title="t('Watermark & QR code')"
    :description="t('Canvas-based components use your theme colors.')"
  >
    <wd-cell :title="t('Show sample watermark')"><wd-switch v-model="watermarkRef" /></wd-cell>
    <view class="watermark-sample gallery-surface">
      <text>{{ t('Your content stays yours.') }}</text>
      <wd-watermark v-if="watermarkRef" content="Preview" :full-screen="false" :z-index="1" />
    </view>
    <wd-qr-code text="https://shadcn-uniapp.guygubaby.top" :size="100"
  /></GallerySection>
</template>

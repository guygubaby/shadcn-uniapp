<script setup lang="ts">
import { ref } from 'vue'
import GallerySection from './GallerySection.vue'
const counterRef = ref(1280)
</script>
<template>
  <view class="gallery-grid">
    <GallerySection title="Buttons" description="Solid, outline, soft, loading, and disabled.">
      <view class="gallery-inline"
        ><wd-button @click="counterRef++">Primary</wd-button
        ><wd-button variant="plain">Outline</wd-button><wd-button variant="soft">Soft</wd-button
        ><wd-button type="danger">Danger</wd-button><wd-button loading>Loading</wd-button
        ><wd-button disabled>Disabled</wd-button
        ><wd-button variant="text">Text action</wd-button></view
      >
    </GallerySection>
    <GallerySection title="Identity" description="Avatar, AvatarGroup, Badge, Icon, Tag, and Text.">
      <view class="gallery-inline"
        ><wd-badge :model-value="3"><wd-avatar text="JL" /></wd-badge
        ><wd-avatar-group :max-count="3"
          ><wd-avatar
            v-for="(name, i) in ['AB', 'CD', 'EF', 'GH']"
            :key="i"
            :text="name" /></wd-avatar-group
        ><wd-icon name="check-circle" size="24"
      /></view>
      <view class="gallery-inline"
        ><wd-tag type="primary">Synced</wd-tag><wd-tag type="success">Online</wd-tag
        ><wd-tag type="warning" variant="plain">Pending</wd-tag
        ><wd-tag type="danger" variant="plain">Destructive</wd-tag></view
      ><wd-text text="A consistent design language." />
    </GallerySection>
    <GallerySection
      title="Progress"
      description="Progress, Circle, CountTo, CountDown, and Loading."
    >
      <wd-progress :percentage="72" /><view class="gallery-inline"
        ><wd-circle :model-value="72" :size="88" text="72%" /><view
          ><wd-count-to :end-val="counterRef" :duration="800" /><wd-count-down
            :time="3600000"
            format="HH:mm:ss" /></view
        ><wd-loading size="24px"
      /></view>
    </GallerySection>
    <GallerySection
      title="Skeleton & empty states"
      description="Loading and no-result states are part of the interface."
      ><wd-skeleton :row-col="[{ width: '55%' }, { width: '100%' }, { width: '80%' }]" /><wd-empty
        description="Nothing here yet"
        :image-size="72"
    /></GallerySection>
    <GallerySection
      title="Layout primitives"
      description="Row, Col, Grid, GridItem, Gap, Divider, Card, and Resize."
    >
      <wd-resize
        ><wd-row :gutter="8"
          ><wd-col :span="12"><view class="gallery-surface">Column one</view></wd-col
          ><wd-col :span="12"><view class="gallery-surface">Column two</view></wd-col></wd-row
        ></wd-resize
      ><wd-gap :height="8" /><wd-divider>Quick actions</wd-divider
      ><wd-grid :column="3"
        ><wd-grid-item icon="home" text="Home" /><wd-grid-item
          icon="setting"
          text="Settings" /><wd-grid-item icon="user" text="Profile" /></wd-grid
      ><wd-card title="Source-owned by design">Adapt the pieces to your product.</wd-card>
    </GallerySection>
    <GallerySection
      title="Watermark & QR code"
      description="Canvas-based components use your theme colors."
      ><wd-watermark content="shadcn-uniapp"
        ><view style="height: 80px; padding: 16px">Your content stays yours.</view></wd-watermark
      ><wd-qr-code text="https://shadcn-uniapp.guygubaby.top" :size="100"
    /></GallerySection>
  </view>
</template>

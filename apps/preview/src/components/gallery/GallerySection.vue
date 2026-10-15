<script setup lang="ts">
import { usePreviewI18n } from '../../i18n'


const { t } = usePreviewI18n()
defineProps<{ title: string; description?: string }>()
</script>
<template>
  <view class="gallery-card"
    ><text class="gallery-title">{{ t(title) }}</text
    ><text v-if="description" class="gallery-description">{{ t(description) }}</text
    ><view class="gallery-content"><slot /></view
  ></view>
</template>

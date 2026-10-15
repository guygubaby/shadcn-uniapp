<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>
<template>
  <view class="gallery-card"
    ><text class="gallery-title">{{ title }}</text
    ><text v-if="description" class="gallery-description">{{ description }}</text
    ><view class="gallery-content"><slot /></view
  ></view>
</template>

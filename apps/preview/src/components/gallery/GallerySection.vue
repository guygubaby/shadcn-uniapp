<script setup lang="ts">
import { usePreviewI18n } from '../../i18n'

const { t } = usePreviewI18n()
defineProps<{ title: string; description?: string; bare?: boolean }>()
</script>
<template>
  <view :class="bare ? undefined : 'gallery-card'"
    ><text v-if="!bare" class="gallery-title">{{ t(title) }}</text
    ><text v-if="!bare && description" class="gallery-description">{{ t(description) }}</text
    ><view :class="bare ? undefined : 'gallery-content'"><slot /></view
  ></view>
</template>

<style scoped>
/* #ifdef H5 */
.gallery-card {
  transition: box-shadow 400ms ease-out;
}
@media (hover: hover) and (pointer: fine) {
  .gallery-card:hover,
  .gallery-card:focus-within {
    box-shadow: 0 16px 36px -20px rgb(0 0 0 / 0.3);
  }
}
@supports ((animation-timeline: view()) and (animation-range: entry)) {
  .gallery-card {
    animation: card-arrive linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 60%;
  }
}
/* Opacity keeps nested Wot overlays positioned against the viewport. */
@keyframes card-arrive {
  from {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .gallery-card {
    animation: none;
    transition: none;
  }
}
/* #endif */
</style>

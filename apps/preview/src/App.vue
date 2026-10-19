<script setup lang="ts">
defineOptions({ name: 'WotPreviewApp' })
</script>

<style>
@import './app.css';

/* #ifdef H5 */
/* Override uni-app's inline viewport-based rem scale for the embedded gallery. */
html {
  font-size: 100% !important;
}
/* #endif */
</style>

<style lang="scss">
@use '@wot-ui/ui/styles/theme/index.scss' as *;
@use './theme.scss';
@use './components/gallery/gallery.scss';

page {
  background: transparent;
}
body {
  font-family: -apple-system, 'PingFang SC', sans-serif;
}
</style>

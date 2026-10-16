<script setup lang="ts">
defineOptions({ name: 'WotPreviewApp' })
</script>

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

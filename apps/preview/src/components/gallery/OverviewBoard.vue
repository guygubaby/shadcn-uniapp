<script setup lang="ts">
import GalleryGrid from './GalleryGrid.vue'
import WorkspaceLayouts from './layouts/WorkspaceLayouts.vue'
import CommerceLayouts from './layouts/CommerceLayouts.vue'
import LifestyleLayouts from './layouts/LifestyleLayouts.vue'
import SourceLayouts from './layouts/SourceLayouts.vue'
</script>
<template>
  <GalleryGrid class="overview-board">
    <WorkspaceLayouts />
    <CommerceLayouts />
    <LifestyleLayouts />
    <SourceLayouts />
  </GalleryGrid>
  <wd-toast selector="layouts" />
</template>

<script setup lang="ts">
import WorkspaceLayouts from './layouts/WorkspaceLayouts.vue'
import CommerceLayouts from './layouts/CommerceLayouts.vue'
import LifestyleLayouts from './layouts/LifestyleLayouts.vue'
import SourceLayouts from './layouts/SourceLayouts.vue'
</script>
<template>
  <view class="overview-board">
    <WorkspaceLayouts />
    <CommerceLayouts />
    <LifestyleLayouts />
    <SourceLayouts />
  </view>
  <wd-toast selector="layouts" />
</template>

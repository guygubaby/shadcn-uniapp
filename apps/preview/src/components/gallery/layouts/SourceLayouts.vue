<script setup lang="ts">
import { blocks } from 'shadcn-uniapp'
import { useToast } from '@wot-ui/ui'
import BlockPreview from '../BlockPreview.vue'
const toast = useToast('layouts')
</script>
<template>
  <BlockPreview
    v-for="block in blocks"
    :key="block.name"
    :block="block.name"
    @notice="toast.show($event)"
  />
</template>

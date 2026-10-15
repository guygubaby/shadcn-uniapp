<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{
  documents: {
    id: string
    title: string
    description: string
    status: 'ready' | 'pending' | 'review'
  }[]
}>()
defineEmits<{ open: [id: string] }>()
</script>
<template>
  <wd-cell-group border>
    <wd-cell
      v-for="document in documents"
      :key="document.id"
      :title="t(document.title)"
      :label="t(document.description)"
      icon="file"
      is-link
      @click="$emit('open', document.id)"
    >
      <wd-tag
        :type="
          document.status === 'ready'
            ? 'success'
            : document.status === 'review'
              ? 'primary'
              : 'warning'
        "
        variant="light"
        >{{
          t(
            document.status === 'ready'
              ? 'Ready'
              : document.status === 'review'
                ? 'In review'
                : 'Required',
          )
        }}</wd-tag
      >
    </wd-cell>
  </wd-cell-group>
  <wd-empty v-if="!documents.length" :description="t('No documents yet')" />
</template>

<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

import { computed, ref } from 'vue'

const props = defineProps<{ items: { id: string; title: string; description?: string }[] }>()
defineEmits<{ select: [id: string] }>()
const queryRef = ref('')
const filtered = computed(() => {
  const query = queryRef.value.trim().toLocaleLowerCase()
  return props.items.filter((item) =>
    `${item.title} ${item.description ?? ''}`.toLocaleLowerCase().includes(query),
  )
})
</script>

<template>
  <wd-search v-model="queryRef" :placeholder="t('Search items')" hide-cancel />
  <wd-gap :height="12" />
  <wd-cell-group v-if="filtered.length" border>
    <wd-cell
      v-for="item in filtered"
      :key="item.id"
      :title="t(item.title)"
      :label="t(item.description)"
      is-link
      @click="$emit('select', item.id)"
    />
  </wd-cell-group>
  <wd-empty v-else :description="t('No matching items')" />
</template>

<script setup lang="ts">
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
  <wd-search v-model="queryRef" placeholder="Search items" hide-cancel />
  <wd-cell-group v-if="filtered.length" border>
    <wd-cell
      v-for="item in filtered"
      :key="item.id"
      :title="item.title"
      :label="item.description"
      is-link
      @click="$emit('select', item.id)"
    />
  </wd-cell-group>
  <wd-empty v-else description="No matching items" />
</template>

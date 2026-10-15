<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ky from 'ky'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'
import { blocks, createPreset } from 'shadcn-uniapp'
import type { ThemeMode } from 'shadcn-uniapp'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CodeBlock from '@/components/CodeBlock.vue'
import WotPreview from '@/components/WotPreview.vue'

const route = useRoute()
const router = useRouter()
const selected = computed(
  () => blocks.find((block) => block.name === route.query.name) ?? blocks[0],
)
const theme = createPreset()
const modeRef = ref<ThemeMode>('light')
const sourceVisibleRef = ref(false)
const registrySchema = z.object({ files: z.array(z.object({ content: z.string() })).min(1) })
const {
  data: source,
  isFetching,
  isError,
  refetch,
} = useQuery({
  queryKey: computed(() => ['block-source', selected.value.name]),
  enabled: sourceVisibleRef,
  staleTime: Infinity,
  retry: 1,
  queryFn: async ({ signal }) => {
    const item = registrySchema.parse(
      await ky.get(`/r/${selected.value.name}.json`, { signal }).json(),
    )
    return item.files[0]!.content
  },
})
watch(selected, () => {
  sourceVisibleRef.value = false
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 py-10 lg:px-8">
    <h1 class="text-3xl font-semibold tracking-tight">A head start. Not a black box.</h1>
    <p class="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
      Practical interfaces composed with Wot UI 2.x. Add the Vue source, then make it yours.
    </p>
    <div class="mt-10 grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav aria-label="Available blocks" class="flex flex-wrap gap-2 lg:flex-col">
        <Button
          v-for="block in blocks"
          :key="block.name"
          :variant="selected.name === block.name ? 'secondary' : 'ghost'"
          class="justify-start"
          :aria-pressed="selected.name === block.name"
          @click="router.replace({ query: { name: block.name } })"
          >{{ block.title }}</Button
        >
      </nav>
      <section class="min-w-0">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold">{{ selected.title }}</h2>
            <p class="mt-2 text-sm text-muted-foreground">{{ selected.description }}</p>
          </div>
          <Badge variant="outline">Wot UI 2.x</Badge>
        </div>
        <CodeBlock
          :code="`pnpm dlx shadcn-uniapp add ${selected.name}`"
          label="Run init first. Available after the npm release."
        />
        <div class="preview-grid mt-6 rounded-xl border p-3 sm:p-6">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p class="text-xs text-muted-foreground">Real components. Try them out.</p>
            <Button
              size="sm"
              variant="outline"
              @click="modeRef = modeRef === 'light' ? 'dark' : 'light'"
              >{{ modeRef === 'light' ? 'Use dark theme' : 'Use light theme' }}</Button
            >
          </div>
          <div class="mx-auto max-w-lg">
            <WotPreview :theme="theme" :mode="modeRef" :block="selected.name" />
          </div>
        </div>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p class="text-xs leading-6 text-muted-foreground">
            UI and local interactions only. Connect save and selection events to your business
            logic.
          </p>
          <Button
            variant="outline"
            :disabled="isFetching"
            @click="sourceVisibleRef = !sourceVisibleRef"
            >{{
              isFetching ? 'Loading...' : sourceVisibleRef ? 'Hide source' : 'View source'
            }}</Button
          >
        </div>
        <div v-if="sourceVisibleRef" class="mt-4">
          <p v-if="isError" role="alert" class="mb-3 text-sm text-destructive">
            Could not load the source. <button class="underline" @click="refetch()">Retry</button>
          </p>
          <CodeBlock v-if="source" :code="source" :label="selected.files[0]" />
        </div>
      </section>
    </div>
  </div>
</template>

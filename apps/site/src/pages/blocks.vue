<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import RevealText from '@/components/motion/RevealText.vue'
import RevealBlock from '@/components/motion/RevealBlock.vue'
import ExpandPanel from '@/components/motion/ExpandPanel.vue'
import { useReducedMotion } from 'motion-v'
import { computed, nextTick, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ky from 'ky'
import { useQuery } from '@tanstack/vue-query'
import { z } from 'zod'
import { blocks, createPreset } from 'shadcn-uniapp'
import { storeToRefs } from 'pinia'
import { useAppearanceStore } from '@/stores/appearance'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CodeBlock from '@/components/CodeBlock.vue'
import WotPreview from '@/components/WotPreview.vue'
import { formatBlockSource } from '@/lib/block-source'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const selected = computed(
  () => blocks.find((block) => block.name === route.query.name) ?? blocks[0],
)
const theme = createPreset()
const { modeRef } = storeToRefs(useAppearanceStore())
const sourceVisibleRef = ref(false)
const previewRef = useTemplateRef<HTMLElement>('block-stage')
const reducedRef = useReducedMotion()
let previewAnimation: Animation | undefined
onUnmounted(() => previewAnimation?.cancel())
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
    return formatBlockSource(item.files[0]!.content)
  },
})
watch(selected, async () => {
  await nextTick()
  previewAnimation?.cancel()
  if (!reducedRef.value)
    previewAnimation = previewRef.value?.animate(
      [
        { opacity: 0.5, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' },
    )
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 py-10 lg:px-8">
    <h1 class="text-3xl font-semibold tracking-tight">
      <RevealText :text="t('A head start. Not a black box.')" />
    </h1>
    <p class="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
      <RevealText
        :text="
          t(
            'Practical interfaces composed with Wot UI 2.x. Add the Vue source, then make it yours.',
          )
        "
        :delay="0.1"
      />
    </p>
    <div class="mt-10 grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav
        :aria-label="t('Available blocks')"
        class="flex flex-wrap gap-2 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-7rem)] lg:flex-col lg:flex-nowrap lg:overflow-y-auto"
      >
        <RevealBlock
          v-for="(block, index) in blocks"
          :key="block.name"
          :delay="Math.min(index * 0.035, 0.28)"
          class="lg:w-full"
          ><Button
            variant="navigation"
            :data-active="selected.name === block.name"
            class="w-full justify-start"
            :aria-pressed="selected.name === block.name"
            @click="router.replace({ query: { ...route.query, name: block.name } })"
            >{{ t(block.title) }}</Button
          ></RevealBlock
        >
      </nav>
      <section ref="block-stage" class="min-w-0">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold">{{ t(selected.title) }}</h2>
            <p class="mt-2 text-sm text-muted-foreground">{{ t(selected.description) }}</p>
          </div>
          <Badge variant="outline">Wot UI 2.x</Badge>
        </div>
        <CodeBlock
          :code="`pnpm dlx shadcn-uniapp add ${selected.name}`"
          :label="t('Run init first. Available after the npm release.')"
        />
        <RevealBlock card :delay="0.15" class="mt-6"
          ><div class="mx-auto w-full max-w-sm rounded-lg border pt-6">
            <WotPreview :theme="theme" :mode="modeRef" :block="selected.name" />
          </div>
        </RevealBlock>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p class="text-xs leading-6 text-muted-foreground">
            {{
              t(
                'UI and local interactions only. Connect save and selection events to your business logic.',
              )
            }}
          </p>
          <Button
            variant="outline"
            :disabled="isFetching"
            @click="sourceVisibleRef = !sourceVisibleRef"
            >{{
              t(isFetching ? 'Loading...' : sourceVisibleRef ? 'Hide source' : 'View source')
            }}</Button
          >
        </div>
        <ExpandPanel :open="sourceVisibleRef"
          ><div class="pt-4">
            <p v-if="isError" role="alert" class="mb-3 text-sm text-destructive">
              {{ t('Could not load the source.') }}
              <button class="underline" @click="refetch()">{{ t('Retry') }}</button>
            </p>
            <CodeBlock v-if="source" :code="source" :label="t(selected.files[0])" />
            <p v-else-if="isFetching" role="status" class="py-4 text-sm text-muted-foreground">
              {{ t('Loading...') }}
            </p>
          </div></ExpandPanel
        >
      </section>
    </div>
  </div>
</template>

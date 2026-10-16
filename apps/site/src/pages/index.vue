<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { ref, shallowRef } from 'vue'
import { ArrowUpRight, Braces, Palette, PackageCheck, Check } from '@lucide/vue'
import { createPreset, presetNames } from 'shadcn-uniapp'
import type { PresetName } from 'shadcn-uniapp'
import { storeToRefs } from 'pinia'
import { useAppearanceStore } from '@/stores/appearance'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import WotPreview from '@/components/WotPreview.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import RevealText from '@/components/motion/RevealText.vue'
import RevealBlock from '@/components/motion/RevealBlock.vue'
import MarketingLink from '@/components/motion/MarketingLink.vue'
import ThemeStory from '@/components/ThemeStory.vue'
import ElasticDivider from '@/components/motion/ElasticDivider.vue'
import ScrollSurface from '@/components/motion/ScrollSurface.vue'

const { t, localePath } = useI18n()
const presetRef = ref<PresetName>('zinc')
const themeRef = shallowRef(createPreset())
const { modeRef } = storeToRefs(useAppearanceStore())
function choose(preset: PresetName) {
  presetRef.value = preset
  themeRef.value = createPreset(preset)
}
const steps = [
  {
    icon: Palette,
    title: 'Theme first. No rewrite.',
    body: 'Keep your wd-* components. Unify colors, radii, and states with semantic tokens.',
  },
  {
    icon: Braces,
    title: 'Own every line.',
    body: 'Add blocks as source code. Change the layout, behavior, and business logic in your own project.',
  },
  {
    icon: PackageCheck,
    title: 'A layer, not a fork.',
    body: 'Wot handles components and platforms. No injected plugins. No dependency patches.',
  },
]
</script>

<template>
  <div class="mx-auto max-w-7xl px-5 lg:px-8">
    <section
      class="grid items-start gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 lg:py-22"
    >
      <div class="lg:sticky lg:top-30">
        <RevealBlock
          ><Badge variant="outline" class="mb-7 font-normal">{{
            t('The theme toolkit for Wot UI 2.x')
          }}</Badge></RevealBlock
        >
        <h1 class="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          <RevealText :text="t('New theme.')" /><br /><RevealText
            :text="t('Same components.')"
            :delay="0.12"
          />
        </h1>
        <p class="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
          <RevealText
            :text="
              t(
                'Bring a shadcn-inspired design language to your uni-app project. Shape your theme, preview real components, and take editable blocks back to your codebase.',
              )
            "
            :delay="0.15"
          />
        </p>
        <RevealBlock :delay="0.35"
          ><div class="mt-8 flex flex-wrap items-center gap-3">
            <MarketingLink to="/create" :label="t('Create a theme')" />
            <Button as-child variant="outline" size="lg"
              ><RouterLink :to="localePath('/docs')">{{ t('Get started') }}</RouterLink></Button
            >
          </div></RevealBlock
        >
        <RevealBlock :delay="0.4"
          ><div class="mt-10 max-w-lg">
            <CodeBlock
              code="pnpm dlx shadcn-uniapp init"
              :label="t('In your existing Wot UI 2.x project')"
            /></div
        ></RevealBlock>
      </div>
      <ScrollSurface
        ><RevealBlock card :delay="0.25"
          ><div class="preview-grid rounded-2xl border p-3 sm:p-5">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div class="flex flex-wrap gap-1.5" :aria-label="t('Choose a preset')">
                <Button
                  v-for="preset in presetNames"
                  :key="preset"
                  :variant="presetRef === preset ? 'default' : 'outline'"
                  size="sm"
                  :aria-pressed="presetRef === preset"
                  @click="choose(preset)"
                  >{{ t(preset) }}<Check v-if="presetRef === preset"
                /></Button>
              </div>
            </div>
            <WotPreview :theme="themeRef" :mode="modeRef" /></div></RevealBlock
      ></ScrollSurface>
    </section>
    <section class="border-t py-14">
      <div class="grid gap-10 md:grid-cols-3">
        <RevealBlock v-for="(item, index) in steps" :key="item.title" :delay="index * 0.1"
          ><article class="group/feature">
            <component
              :is="item.icon"
              class="mb-5 size-6 scale-100 rotate-0 text-accent-foreground transition-transform duration-500 group-hover/feature:scale-110 group-hover/feature:-rotate-6 motion-reduce:transform-none motion-reduce:transition-none"
              aria-hidden="true"
            />
            <h2 class="text-lg font-semibold">{{ t(item.title) }}</h2>
            <p class="mt-3 text-sm leading-7 text-muted-foreground">{{ t(item.body) }}</p>
          </article></RevealBlock
        >
      </div>
    </section>
    <ElasticDivider />
    <ThemeStory />
    <section class="grid gap-6 border-t py-14 md:grid-cols-2 md:items-center">
      <RevealBlock>
        <h2 class="text-2xl font-semibold tracking-tight">
          <RevealText :text="t('One config. A complete look.')" />
        </h2>
        <p class="mt-3 text-sm leading-7 text-muted-foreground">
          {{
            t(
              'The same generator powers the Creator, exported styles, and Wot preview. What you see is what you take with you.',
            )
          }}
        </p>
      </RevealBlock>
      <RevealBlock :delay="0.15"
        ><div class="flex flex-wrap gap-3 md:justify-end">
          <Button as-child variant="outline"
            ><RouterLink :to="localePath('/blocks')">{{ t('Explore blocks') }}</RouterLink></Button
          ><Button as-child
            ><RouterLink :to="localePath('/create')">{{ t('Open Creator') }}</RouterLink></Button
          >
        </div></RevealBlock
      >
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { ArrowUpRight, Braces, Palette, PackageCheck, Check } from '@lucide/vue'
import { createPreset, presetNames } from 'shadcn-uniapp'
import type { PresetName, ThemeMode } from 'shadcn-uniapp'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import WotPreview from '@/components/WotPreview.vue'
import CodeBlock from '@/components/CodeBlock.vue'

const presetRef = ref<PresetName>('zinc')
const themeRef = shallowRef(createPreset())
const modeRef = ref<ThemeMode>('light')
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
        <Badge variant="outline" class="mb-7 font-normal">The theme toolkit for Wot UI 2.x</Badge>
        <h1 class="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          New theme.<br />Same components.
        </h1>
        <p class="mt-6 max-w-lg text-base leading-8 text-muted-foreground">
          Bring a shadcn-inspired design language to your uni-app project. Shape your theme, preview
          real components, and take editable blocks back to your codebase.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <Button as-child size="lg"
            ><RouterLink to="/create">Create a theme<ArrowUpRight /></RouterLink
          ></Button>
          <Button as-child variant="outline" size="lg"
            ><RouterLink to="/docs">Get started</RouterLink></Button
          >
        </div>
        <div class="mt-10 max-w-lg">
          <CodeBlock
            code="pnpm dlx shadcn-uniapp init"
            label="In your existing Wot UI 2.x project"
          />
        </div>
        <p class="mt-3 text-xs leading-6 text-muted-foreground">
          Until the npm release, use the CLI built from this repository.
          <RouterLink to="/docs" class="underline underline-offset-4">Local setup</RouterLink>
        </p>
      </div>
      <div class="preview-grid rounded-2xl border p-3 sm:p-5">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap gap-1.5" aria-label="Choose a preset">
            <Button
              v-for="preset in presetNames"
              :key="preset"
              :variant="presetRef === preset ? 'default' : 'outline'"
              size="sm"
              :aria-pressed="presetRef === preset"
              @click="choose(preset)"
              >{{ preset }}<Check v-if="presetRef === preset"
            /></Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            :aria-pressed="modeRef === 'dark'"
            @click="modeRef = modeRef === 'light' ? 'dark' : 'light'"
            >{{ modeRef === 'light' ? 'Dark preview' : 'Light preview' }}</Button
          >
        </div>
        <WotPreview :theme="themeRef" :mode="modeRef" />
      </div>
    </section>
    <section class="border-t py-14">
      <div class="grid gap-10 md:grid-cols-3">
        <article v-for="item in steps" :key="item.title">
          <component
            :is="item.icon"
            class="mb-5 size-6 text-accent-foreground"
            aria-hidden="true"
          />
          <h2 class="text-lg font-semibold">{{ item.title }}</h2>
          <p class="mt-3 text-sm leading-7 text-muted-foreground">{{ item.body }}</p>
        </article>
      </div>
    </section>
    <section class="grid gap-6 border-t py-14 md:grid-cols-2 md:items-center">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">One config. A complete look.</h2>
        <p class="mt-3 text-sm leading-7 text-muted-foreground">
          The same generator powers the Creator, exported styles, and Wot preview. What you see is
          what you take with you.
        </p>
      </div>
      <div class="flex flex-wrap gap-3 md:justify-end">
        <Button as-child variant="outline"
          ><RouterLink to="/blocks">Explore blocks</RouterLink></Button
        ><Button as-child><RouterLink to="/create">Open Creator</RouterLink></Button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { blocks, presetNames } from 'shadcn-uniapp'
import { ArrowUpRight } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import RevealBlock from '@/components/motion/RevealBlock.vue'
import RevealText from '@/components/motion/RevealText.vue'
import ScrollSurface from '@/components/motion/ScrollSurface.vue'

const { t } = useI18n()
const steps = [
  {
    number: '01',
    title: 'Find your expression.',
    description:
      'Start from a preset. Shape the colors, typography, radii, and density until it feels like your product.',
  },
  {
    number: '02',
    title: 'See every little detail.',
    description:
      'Try real Wot components and complete app layouts together. Your theme reaches every input, card, and overlay.',
  },
  {
    number: '03',
    title: 'Take it back to your code.',
    description:
      'Export the theme and add editable Vue blocks. Keep building with the components and business logic you already know.',
  },
]
const facts = [
  { value: '100', label: 'Wot components' },
  { value: String(blocks.length), label: 'Editable blocks' },
  { value: String(presetNames.length), label: 'Starting points' },
]
</script>
<template>
  <ScrollSurface
    ><section
      class="my-8 overflow-hidden rounded-3xl bg-foreground px-6 py-14 text-background sm:px-10 lg:my-14 lg:p-16"
    >
      <RevealBlock
        ><p class="mb-8 text-xs font-medium tracking-widest uppercase opacity-60">
          {{ t('A little theme. A lot of possibility.') }}
        </p></RevealBlock
      >
      <h2
        class="max-w-3xl text-4xl leading-tight font-medium tracking-tight sm:text-5xl lg:text-6xl"
      >
        <RevealText :text="t('Your components.')" /><br /><RevealText
          :text="t('Your character.')"
          :delay="0.12"
        />
      </h2>
      <div class="mt-12 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <p class="max-w-md text-base leading-8 opacity-70">
            <RevealText
              :text="
                t(
                  'A family portal. A new storefront. The next great app. Give familiar components a language that belongs to you.',
                )
              "
              :delay="0.1"
            />
          </p>
          <div class="mt-10 flex flex-wrap gap-8">
            <RevealBlock v-for="(fact, index) in facts" :key="fact.label" :delay="index * 0.1">
              <p class="text-4xl font-medium tracking-tight tabular-nums">{{ t(fact.value) }}</p>
              <p class="mt-2 text-xs opacity-60">{{ t(fact.label) }}</p>
            </RevealBlock>
          </div>
          <RevealBlock :delay="0.25"
            ><Button as-child variant="secondary" size="lg" class="mt-10 rounded-full"
              ><RouterLink to="/blocks"
                >{{ t('Explore the building blocks') }}<ArrowUpRight /></RouterLink></Button
          ></RevealBlock>
        </div>
        <div class="flex flex-col gap-8">
          <RevealBlock card v-for="(step, index) in steps" :key="step.number" :delay="index * 0.08">
            <div class="flex items-start gap-5 border-t border-current/20 pt-6">
              <span class="pt-1 font-mono text-xs opacity-50">{{ t(step.number) }}</span>
              <div>
                <h3 class="text-xl font-medium">{{ t(step.title) }}</h3>
                <p class="mt-3 text-sm leading-7 opacity-65">{{ t(step.description) }}</p>
              </div>
            </div>
          </RevealBlock>
        </div>
      </div>
    </section></ScrollSurface
  >
</template>

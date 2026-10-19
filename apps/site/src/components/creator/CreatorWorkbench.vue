<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { onKeyStroke, useMediaQuery } from '@vueuse/core'
import RevealBlock from '@/components/motion/RevealBlock.vue'
import { ArrowUpRight, Check, Code2, Copy, RotateCcw, Settings2, Shuffle, X } from '@lucide/vue'
import { encodeThemePreset, getContrastChecks, themeSchema } from 'shadcn-uniapp'
import type { ColorTokens } from 'shadcn-uniapp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import ColorField from '@/components/ColorField.vue'
import WotPreview from '@/components/WotPreview.vue'
import { copyText } from '@/lib/browser'
import CreatorPicker from './CreatorPicker.vue'
import ThemeExportDialog from './ThemeExportDialog.vue'
import ThemeImportDialog from './ThemeImportDialog.vue'
import {
  accentOptions,
  baseOptions,
  densityOptions,
  fontOptions,
  radiusOptions,
  styleOptions,
} from './options'
import type { SettingKey } from './options'
import { useCreatorTheme } from './useCreatorTheme'

const { t } = useI18n()
const {
  themeRef,
  modeRef,
  locksRef,
  selections,
  apply,
  select,
  color,
  toggleLock,
  shuffle,
  reset,
} = useCreatorTheme()
const exportRef = ref(false)
const importRef = ref(false)
const sidebarRef = ref(false)
const wideRef = useMediaQuery('(min-width: 1024px)')
const sidebarElementRef = useTemplateRef<HTMLElement>('sidebar')
onKeyStroke('Escape', () => {
  sidebarRef.value = false
})
watch(wideRef, () => {
  sidebarRef.value = false
})
watch(sidebarRef, async (open) => {
  const returnFocus = !open && sidebarElementRef.value?.contains(document.activeElement)
  await nextTick()
  if (open !== sidebarRef.value) return
  if (open) {
    sidebarElementRef.value?.querySelector<HTMLButtonElement>('button')?.focus()
  } else if (returnFocus) {
    document.querySelector<HTMLButtonElement>('[data-sidebar-toggle]')?.focus()
  }
})
const nameRef = ref(themeRef.value.name)
const nameValid = computed(() => themeSchema.shape.name.safeParse(nameRef.value).success)
watch(
  () => themeRef.value.name,
  (value) => {
    nameRef.value = value
  },
)
const checks = computed(() => getContrastChecks(themeRef.value, modeRef.value))
const pickers: {
  key: SettingKey
  label: string
  options: typeof accentOptions
  kind?: 'color' | 'font' | 'radius' | 'style'
  group?: boolean
}[] = [
  { key: 'style', label: 'Style', options: styleOptions, kind: 'style' },
  { key: 'base', label: 'Base color', options: baseOptions, kind: 'color' },
  { key: 'accent', label: 'Theme', options: accentOptions, kind: 'color' },
  { key: 'chart', label: 'Chart color', options: accentOptions, kind: 'color' },
  { key: 'heading', label: 'Heading', options: fontOptions, kind: 'font', group: true },
  { key: 'font', label: 'Font', options: fontOptions, kind: 'font' },
  { key: 'radius', label: 'Radius', options: radiusOptions, kind: 'radius', group: true },
  { key: 'density', label: 'Density', options: densityOptions },
]
const fields: { key: keyof ColorTokens; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'primaryForeground', label: 'Primary text' },
  { key: 'background', label: 'Background' },
  { key: 'foreground', label: 'Foreground' },
  { key: 'card', label: 'Card' },
  { key: 'border', label: 'Border' },
  { key: 'muted', label: 'Muted' },
  { key: 'mutedForeground', label: 'Muted text' },
  { key: 'destructive', label: 'Destructive' },
  { key: 'destructiveForeground', label: 'Destructive text (custom)' },
]
function rename(value: string | number) {
  nameRef.value = String(value)
  if (nameValid.value) apply({ ...themeRef.value, name: nameRef.value })
}
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <h1 class="sr-only">{{ t('Wot UI theme creator for uni-app') }}</h1>
    <div class="creator-workbench flex h-[calc(100dvh-3.5rem)] gap-4 p-3 lg:gap-6 lg:p-5 lg:pt-1">
      <Transition name="fade"
        ><button
          v-if="sidebarRef"
          class="fixed inset-0 z-40 bg-black/40 lg:hidden"
          :aria-label="t('Close customization panel')"
          @click="sidebarRef = false"
      /></Transition>
      <Transition name="drawer">
        <aside
          ref="sidebar"
          v-show="sidebarRef || wideRef"
          class="creator-sidebar fixed inset-y-3 left-3 z-50 flex w-60 shrink-0 flex-col overflow-hidden rounded-2xl border p-3 shadow-xl lg:static lg:z-auto lg:w-56 lg:shadow-none"
          :aria-label="t('Theme customization')"
        >
          <div
            class="mb-3 flex h-9 shrink-0 items-center justify-between rounded-lg border border-white/8 px-2.5 text-xs text-white/70"
          >
            <span>{{ t('Customize') }}</span
            ><Settings2 class="size-3.5 max-lg:hidden" /><button
              class="lg:hidden"
              :aria-label="t('Close customization panel')"
              @click="sidebarRef = false"
            >
              <X class="size-4" />
            </button>
          </div>
          <div
            class="creator-scroll flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-0.5 pt-1 pr-1 pb-3"
          >
            <RevealBlock
              v-for="(picker, index) in pickers"
              :key="picker.key"
              :delay="Math.min(index * 0.04, 0.24)"
              :class="picker.group && 'mt-2 border-t border-white/8 pt-3'"
            >
              <CreatorPicker
                :label="t(picker.label)"
                :value="selections[picker.key]"
                :options="picker.options"
                :locked="locksRef.has(picker.key)"
                :kind="picker.kind"
                @select="select(picker.key, $event)"
                @lock="toggleLock(picker.key)"
              />
            </RevealBlock>
            <Popover>
              <PopoverTrigger as-child
                ><button
                  class="creator-picker mt-2 flex min-h-11 items-center justify-between rounded-xl border px-3.5 text-sm"
                >
                  <span>{{ t('Custom colors') }}</span
                  ><Settings2 class="size-3.5 text-white/50" /></button
              ></PopoverTrigger>
              <PopoverContent
                side="right"
                align="end"
                class="max-h-[80dvh] w-84 overflow-y-auto p-5"
                ><h2 class="text-sm font-semibold">{{ t('Fine-tune your colors') }}</h2>
                <p class="mt-2 text-xs leading-5 text-muted-foreground">
                  {{ t('Editing the') }} {{ t(modeRef) }}
                  {{ t('palette. Use the sun / moon control to switch.') }}
                </p>
                <div class="mt-5 grid grid-cols-2 gap-4">
                  <ColorField
                    v-for="field in fields"
                    :id="`custom-${field.key}`"
                    :key="field.key"
                    :label="t(field.label)"
                    :model-value="themeRef[modeRef][field.key]"
                    @update:model-value="color(field.key, $event)"
                  />
                </div>
                <p class="mt-4 text-xs leading-5 text-muted-foreground">
                  {{
                    t(
                      'Wot solid buttons share Primary text. Destructive text is a semantic token for your custom components.',
                    )
                  }}
                </p></PopoverContent
              >
            </Popover>
          </div>
          <div class="flex shrink-0 flex-col gap-2 border-t border-white/8 pt-3">
            <Tooltip
              ><TooltipTrigger as-child
                ><button
                  class="creator-secondary flex h-8 items-center justify-center gap-2 rounded-lg border text-xs"
                  @click="copyText(encodeThemePreset(themeRef))"
                >
                  <Copy class="size-3" />{{ t('Copy preset code') }}
                </button></TooltipTrigger
              ><TooltipContent side="right">{{
                t('All theme settings are included in this code')
              }}</TooltipContent></Tooltip
            >
            <button
              class="creator-secondary h-8 rounded-lg border text-xs"
              @click="importRef = true"
            >
              {{ t('Open preset') }}
            </button>
            <button
              class="creator-secondary flex h-8 items-center justify-center gap-2 rounded-lg border text-xs"
              @click="shuffle"
            >
              <Shuffle class="size-3" />{{ t('Shuffle') }}
            </button>
            <button
              class="mt-1 flex h-9 items-center justify-center gap-2 rounded-lg bg-creator-action text-sm font-semibold text-creator-action-foreground transition-colors hover:bg-creator-action-hover disabled:opacity-50"
              :disabled="!nameValid"
              @click="exportRef = true"
            >
              {{ t('Create theme') }}<ArrowUpRight class="size-3.5" />
            </button>
          </div></aside
      ></Transition>
      <RevealBlock class="min-w-0 flex-1" :delay="0.15">
        <section
          class="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-muted/40"
          :aria-label="t('Component preview')"
          :inert="sidebarRef && !wideRef ? true : undefined"
        >
          <div
            class="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b bg-background/80 px-3 py-2.5 lg:px-5"
          >
            <div class="flex min-w-0 items-center gap-2 lg:hidden">
              <Button
                data-sidebar-toggle
                class="lg:hidden"
                variant="outline"
                size="icon"
                :aria-label="t('Customize theme')"
                @click="sidebarRef = true"
                ><Settings2
              /></Button>
            </div>
            <div class="ml-auto flex items-center gap-1">
              <Tooltip
                ><TooltipTrigger as-child
                  ><Button variant="ghost" size="icon" :aria-label="t('Reset theme')" @click="reset"
                    ><RotateCcw /></Button></TooltipTrigger
                ><TooltipContent>{{ t('Reset theme') }}</TooltipContent></Tooltip
              >
              <Tooltip
                ><TooltipTrigger as-child
                  ><Button
                    variant="ghost"
                    size="icon"
                    :aria-label="t('View theme code')"
                    @click="exportRef = true"
                    ><Code2 /></Button></TooltipTrigger
                ><TooltipContent>{{ t('Export and code') }}</TooltipContent></Tooltip
              >
            </div>
          </div>
          <div class="min-h-0 flex-1">
            <WotPreview :theme="themeRef" :mode="modeRef" block="components" canvas />
          </div>
          <div
            class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-2.5 text-xs text-muted-foreground"
          >
            <span class="flex items-center gap-1.5"
              ><span class="size-1.5 rounded-full bg-creator-action" />{{ t('Live Wot UI 2.3.2')
              }}<span class="hidden xl:inline"> {{ t('/ uni-app H5') }}</span></span
            >
            <Popover
              ><PopoverTrigger as-child
                ><button class="flex items-center gap-1.5 hover:text-foreground">
                  <Check class="size-3.5" />{{ t('Contrast') }}
                  {{ t(checks.filter((check) => check.passes).length) }}/{{ t(checks.length) }}
                </button></PopoverTrigger
              ><PopoverContent align="end" class="w-64"
                ><h2 class="mb-3 text-sm font-semibold">{{ t('Text contrast') }}</h2>
                <div
                  v-for="check in checks"
                  :key="check.name"
                  class="flex items-center justify-between py-1.5 text-xs"
                >
                  <span>{{ t(check.name) }}</span
                  ><span :class="check.passes ? 'text-positive' : 'text-destructive'"
                    >{{ t(check.ratio.toFixed(2)) }} : 1</span
                  >
                </div>
                <p class="mt-3 text-xs leading-5 text-muted-foreground">
                  {{ t('Normal text needs 4.5 : 1. This is not a full accessibility audit.') }}
                </p></PopoverContent
              ></Popover
            >
            <Popover
              ><PopoverTrigger as-child
                ><button class="flex items-center gap-1.5 font-mono hover:text-foreground">
                  {{ t(themeRef.name) }}<Settings2 class="size-3" /></button></PopoverTrigger
              ><PopoverContent align="end" class="w-72"
                ><Label for="creator-name">{{ t('Theme name') }}</Label
                ><Input
                  id="creator-name"
                  class="mt-2"
                  :model-value="nameRef"
                  :aria-invalid="!nameValid"
                  @update:model-value="rename"
                />
                <p class="mt-2 text-xs leading-5 text-muted-foreground">
                  {{ t('Lowercase letters, numbers, and hyphens. Start with a letter.') }}
                </p></PopoverContent
              ></Popover
            >
          </div>
        </section></RevealBlock
      >
    </div>
    <ThemeExportDialog v-model:open="exportRef" :theme="themeRef" />
    <ThemeImportDialog v-model:open="importRef" @apply="apply" />
  </TooltipProvider>
</template>

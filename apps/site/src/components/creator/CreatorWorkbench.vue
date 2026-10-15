<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  ArrowUpRight,
  Check,
  Code2,
  BatteryFull,
  Signal,
  Wifi,
  Link,
  Moon,
  RotateCcw,
  Settings2,
  Shuffle,
  Sun,
  X,
} from '@lucide/vue'
import { getContrastChecks, themeSchema } from 'shadcn-uniapp'
import type { ColorTokens } from 'shadcn-uniapp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import ColorField from '@/components/ColorField.vue'
import WotPreview from '@/components/WotPreview.vue'
import { copyText } from '@/lib/browser'
import { cn } from '@/lib/utils'
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
import type { PreviewBlock, SettingKey } from './options'
import { useCreatorTheme } from './useCreatorTheme'

const {
  themeRef,
  modeRef,
  locksRef,
  selections,
  apply,
  select,
  color,
  setMode,
  toggleLock,
  shuffle,
  reset,
} = useCreatorTheme()
const exportRef = ref(false)
const importRef = ref(false)
const sidebarRef = ref(false)
const previewRef = ref<PreviewBlock>('components')
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
const previews: { value: PreviewBlock; label: string }[] = [
  { value: 'components', label: 'Overview' },
  { value: 'catalog', label: 'Components' },
  { value: 'profile-card', label: 'Profile' },
  { value: 'settings-form', label: 'Settings' },
  { value: 'filter-list', label: 'Lists' },
]
function rename(value: string | number) {
  nameRef.value = String(value)
  if (nameValid.value) apply({ ...themeRef.value, name: nameRef.value })
}
function share() {
  void copyText(window.location.href)
}
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <div
      class="creator-workbench flex min-h-[calc(100dvh-3.5rem)] gap-4 p-3 lg:h-[calc(100dvh-3.5rem)] lg:gap-6 lg:p-5 lg:pt-1"
    >
      <button
        v-if="sidebarRef"
        class="fixed inset-0 z-40 bg-black/40 lg:hidden"
        aria-label="Close customization panel"
        @click="sidebarRef = false"
      />
      <aside
        :class="
          cn(
            'creator-sidebar fixed inset-y-3 left-3 z-50 flex w-60 shrink-0 flex-col overflow-hidden rounded-2xl border p-3 shadow-xl lg:static lg:z-auto lg:w-56 lg:shadow-none',
            sidebarRef ? 'flex' : 'hidden lg:flex',
          )
        "
        aria-label="Theme customization"
      >
        <div
          class="mb-3 flex h-9 shrink-0 items-center justify-between rounded-lg border border-white/8 px-2.5 text-xs text-white/70"
        >
          <span>Customize</span><Settings2 class="size-3.5 max-lg:hidden" /><button
            class="lg:hidden"
            aria-label="Close customization panel"
            @click="sidebarRef = false"
          >
            <X class="size-4" />
          </button>
        </div>
        <div
          class="creator-scroll flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-0.5 pt-1 pr-1 pb-3"
        >
          <div
            v-for="picker in pickers"
            :key="picker.key"
            :class="picker.group && 'mt-2 border-t border-white/8 pt-3'"
          >
            <CreatorPicker
              :label="picker.label"
              :value="selections[picker.key]"
              :options="picker.options"
              :locked="locksRef.has(picker.key)"
              :kind="picker.kind"
              @select="select(picker.key, $event)"
              @lock="toggleLock(picker.key)"
            />
          </div>
          <Popover>
            <PopoverTrigger as-child
              ><button
                class="creator-picker mt-2 flex min-h-11 items-center justify-between rounded-xl border px-3.5 text-sm"
              >
                <span>Custom colors</span><Settings2 class="size-3.5 text-white/50" /></button
            ></PopoverTrigger>
            <PopoverContent side="right" align="end" class="max-h-[80dvh] w-84 overflow-y-auto p-5"
              ><h2 class="text-sm font-semibold">Fine-tune your colors</h2>
              <p class="mt-2 text-xs leading-5 text-muted-foreground">
                Editing the {{ modeRef }} palette. Use the sun / moon control to switch.
              </p>
              <div class="mt-5 grid grid-cols-2 gap-4">
                <ColorField
                  v-for="field in fields"
                  :id="`custom-${field.key}`"
                  :key="field.key"
                  :label="field.label"
                  :model-value="themeRef[modeRef][field.key]"
                  @update:model-value="color(field.key, $event)"
                />
              </div>
              <p class="mt-4 text-xs leading-5 text-muted-foreground">
                Wot solid buttons share Primary text. Destructive text is a semantic token for your
                custom components.
              </p></PopoverContent
            >
          </Popover>
        </div>
        <div class="flex shrink-0 flex-col gap-2 border-t border-white/8 pt-3">
          <Tooltip
            ><TooltipTrigger as-child
              ><button
                class="creator-secondary flex h-8 items-center justify-center gap-2 rounded-lg border text-xs"
                @click="share"
              >
                <Link class="size-3" />Copy preset link
              </button></TooltipTrigger
            ><TooltipContent side="right"
              >All settings are included in the URL</TooltipContent
            ></Tooltip
          >
          <button class="creator-secondary h-8 rounded-lg border text-xs" @click="importRef = true">
            Open preset
          </button>
          <button
            class="creator-secondary flex h-8 items-center justify-center gap-2 rounded-lg border text-xs"
            @click="shuffle"
          >
            <Shuffle class="size-3" />Shuffle
          </button>
          <button
            class="mt-1 flex h-9 items-center justify-center gap-2 rounded-lg bg-creator-action text-sm font-semibold text-creator-action-foreground transition-colors hover:bg-creator-action-hover disabled:opacity-50"
            :disabled="!nameValid"
            @click="exportRef = true"
          >
            Create theme<ArrowUpRight class="size-3.5" />
          </button>
        </div>
      </aside>
      <section
        class="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-muted/40"
        aria-label="Component preview"
      >
        <div
          class="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b bg-background/80 px-3 py-2.5 lg:px-5"
        >
          <div class="flex min-w-0 items-center gap-2">
            <Button
              class="lg:hidden"
              variant="outline"
              size="icon"
              aria-label="Customize theme"
              @click="sidebarRef = true"
              ><Settings2 /></Button
            ><ToggleGroup
              type="single"
              :model-value="previewRef"
              aria-label="Preview examples"
              @update:model-value="
                (value) => {
                  if (value) previewRef = value as PreviewBlock
                }
              "
              ><ToggleGroupItem
                v-for="preview in previews"
                :key="preview.value"
                :value="preview.value"
                class="px-2.5 text-xs sm:px-3"
                >{{ preview.label }}</ToggleGroupItem
              ></ToggleGroup
            >
          </div>
          <div class="flex items-center gap-1">
            <span class="mr-2 hidden text-xs text-muted-foreground sm:inline">Mobile preview</span>
            <Tooltip
              ><TooltipTrigger as-child
                ><Button
                  variant="ghost"
                  size="icon"
                  :aria-label="modeRef === 'light' ? 'Use dark theme' : 'Use light theme'"
                  @click="setMode(modeRef === 'light' ? 'dark' : 'light')"
                  ><Moon v-if="modeRef === 'light'" /><Sun v-else /></Button></TooltipTrigger
              ><TooltipContent>Toggle preview theme</TooltipContent></Tooltip
            >
            <Tooltip
              ><TooltipTrigger as-child
                ><Button variant="ghost" size="icon" aria-label="Reset theme" @click="reset"
                  ><RotateCcw /></Button></TooltipTrigger
              ><TooltipContent>Reset theme</TooltipContent></Tooltip
            >
            <Tooltip
              ><TooltipTrigger as-child
                ><Button
                  variant="ghost"
                  size="icon"
                  aria-label="View theme code"
                  @click="exportRef = true"
                  ><Code2 /></Button></TooltipTrigger
              ><TooltipContent>Export and code</TooltipContent></Tooltip
            >
          </div>
        </div>
        <div
          :class="
            cn(
              'creator-canvas min-h-0 flex-1 overflow-auto p-3 sm:p-6',
              modeRef === 'dark' && 'creator-canvas-dark',
            )
          "
        >
          <div
            class="mx-auto w-94 overflow-hidden rounded-3xl border shadow-sm"
            :style="{
              backgroundColor: themeRef[modeRef].background,
              color: themeRef[modeRef].foreground,
            }"
          >
            <div
              class="flex h-9 items-center justify-between px-5 text-xs font-semibold"
              aria-hidden="true"
            >
              <span>9:41</span
              ><span class="flex items-center gap-1"
                ><Signal class="size-3" /><Wifi class="size-3" /><BatteryFull class="size-4"
              /></span>
            </div>
            <div class="h-180">
              <WotPreview :theme="themeRef" :mode="modeRef" :block="previewRef" canvas />
            </div>
          </div>
        </div>
        <div
          class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-2.5 text-xs text-muted-foreground"
        >
          <span class="flex items-center gap-1.5"
            ><span class="size-1.5 rounded-full bg-creator-action" />Live Wot UI 2.3.2<span
              class="hidden xl:inline"
            >
              / uni-app H5</span
            ></span
          >
          <Popover
            ><PopoverTrigger as-child
              ><button class="flex items-center gap-1.5 hover:text-foreground">
                <Check class="size-3.5" />Contrast
                {{ checks.filter((check) => check.passes).length }}/{{ checks.length }}
              </button></PopoverTrigger
            ><PopoverContent align="end" class="w-64"
              ><h2 class="mb-3 text-sm font-semibold">Text contrast</h2>
              <div
                v-for="check in checks"
                :key="check.name"
                class="flex items-center justify-between py-1.5 text-xs"
              >
                <span>{{ check.name }}</span
                ><span :class="check.passes ? 'text-positive' : 'text-destructive'"
                  >{{ check.ratio.toFixed(2) }} : 1</span
                >
              </div>
              <p class="mt-3 text-xs leading-5 text-muted-foreground">
                Normal text needs 4.5 : 1. This is not a full accessibility audit.
              </p></PopoverContent
            ></Popover
          >
          <Popover
            ><PopoverTrigger as-child
              ><button class="flex items-center gap-1.5 font-mono hover:text-foreground">
                {{ themeRef.name }}<Settings2 class="size-3" /></button></PopoverTrigger
            ><PopoverContent align="end" class="w-72"
              ><Label for="creator-name">Theme name</Label
              ><Input
                id="creator-name"
                class="mt-2"
                :model-value="nameRef"
                :aria-invalid="!nameValid"
                @update:model-value="rename"
              />
              <p class="mt-2 text-xs leading-5 text-muted-foreground">
                Lowercase letters, numbers, and hyphens. Start with a letter.
              </p></PopoverContent
            ></Popover
          >
        </div>
      </section>
    </div>
    <ThemeExportDialog v-model:open="exportRef" :theme="themeRef" />
    <ThemeImportDialog v-model:open="importRef" @apply="apply" />
  </TooltipProvider>
</template>

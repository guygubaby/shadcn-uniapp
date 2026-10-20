<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { computed, ref } from 'vue'
import { ChevronDown, Search, Sparkles } from '@lucide/vue'
import { encodeThemePreset, generateThemeCss } from 'shadcn-uniapp'
import type { ThemeConfig } from 'shadcn-uniapp'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import CodeBlock from '@/components/CodeBlock.vue'

const { t } = useI18n()
const openRef = defineModel<boolean>('open', { default: false })
const props = defineProps<{ theme: ThemeConfig }>()
const lucideRef = ref(true)
const presetCode = computed(() => encodeThemePreset(props.theme))
const css = computed(() => generateThemeCss(props.theme))
const agentInstall = computed(() =>
  [
    t(
      'Install and initialize shadcn-uniapp in this project with pnpm dlx shadcn-uniapp@latest init --preset {preset}.',
    ).replace('{preset}', presetCode.value),
    t(
      lucideRef.value
        ? 'Enable @lucide/vue with the lucideUniapp Vite plugin.'
        : 'Keep existing icons; do not install @lucide/vue or enable lucideUniapp.',
    ),
    t(
      'Follow https://shadcn-uniapp.guygubaby.top/docs and UI_STYLE_GUIDE.md to apply the theme to existing shared UI and pages, resolve legacy theme overrides, preserve business behavior and the utility framework, then inspect the UI and verify H5 and WeChat builds.',
    ),
  ].join(' '),
)
const install = computed(() =>
  [
    'pnpm add -D shadcn-uniapp@latest sass',
    ...(lucideRef.value ? ['pnpm add @lucide/vue'] : []),
    `pnpm dlx shadcn-uniapp@latest init --preset ${presetCode.value}`,
  ].join('\n'),
)
const icons = `import { lucideUniapp } from 'shadcn-uniapp/vite'

// Add before uni() in your existing Vite 5 config.
plugins: [lucideUniapp(), uni()]

import { Search } from '@lucide/vue'`
</script>

<template>
  <Dialog v-model:open="openRef">
    <DialogContent class="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{{ t('Your theme is ready.') }}</DialogTitle>
        <DialogDescription>{{
          t('Bring it to your existing Wot UI 2.x project. No component migration required.')
        }}</DialogDescription>
      </DialogHeader>
      <Tabs default-value="install" class="min-w-0">
        <TabsList>
          <TabsTrigger value="install">{{ t('Install') }}</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
        </TabsList>
        <TabsContent value="install" class="flex flex-col gap-5 pt-3">
          <div
            class="flex items-center justify-between gap-4 rounded-md border border-foreground/20 bg-muted/50 p-4"
          >
            <div class="min-w-0 space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <Label for="export-lucide">{{ t('Use Lucide icons') }}</Label>
                <Badge><Sparkles aria-hidden="true" />{{ t('Recommended') }}</Badge>
              </div>
              <p id="export-lucide-description" class="text-xs leading-5 text-muted-foreground">
                {{ t('Recommended across your project for a consistent icon style.') }}
              </p>
            </div>
            <Switch
              id="export-lucide"
              v-model="lucideRef"
              aria-describedby="export-lucide-description"
            />
          </div>
          <CodeBlock
            :code="agentInstall"
            label="One-line agent install"
            class="[&_pre]:whitespace-pre-wrap"
          />
          <details class="group rounded-lg border">
            <summary
              class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden"
            >
              {{ t('Install manually') }}
              <ChevronDown
                class="size-4 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <div class="flex flex-col gap-3 border-t p-4">
              <p class="text-sm text-muted-foreground">
                {{ t('Run in your project to apply this theme.') }}
              </p>
              <CodeBlock :code="install" label="pnpm" />
              <CodeBlock v-if="lucideRef" :code="icons" label="vite.config.ts / icons" />
              <div
                v-if="lucideRef"
                class="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3"
              >
                <span class="mr-auto text-xs text-muted-foreground">{{ t('Preview') }}</span>
                <Search class="size-5" aria-hidden="true" />
                <span class="text-sm font-medium">Search</span>
              </div>
              <p class="text-xs leading-6 text-muted-foreground">
                {{
                  t(
                    'Custom fonts use system fallbacks on WeChat unless you load the font yourself.',
                  )
                }}
              </p>
            </div>
          </details>
        </TabsContent>
        <TabsContent value="css" class="flex flex-col gap-3 pt-3"
          ><p class="text-sm text-muted-foreground">
            {{
              t(
                'Import after the Wot theme stylesheet. Generated output includes light and dark tokens.',
              )
            }}
          </p>
          <div class="max-h-80 overflow-auto"><CodeBlock :code="css" label="shadcn.scss" /></div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>

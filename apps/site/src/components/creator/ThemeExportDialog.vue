<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { computed, ref } from 'vue'
import { Bot, Copy, Sparkles } from '@lucide/vue'
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
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { copyText } from '@/lib/browser'
import { createStyleGuidePrompt } from '@/lib/style-guide'

const { t } = useI18n()
const openRef = defineModel<boolean>('open', { default: false })
const props = defineProps<{ theme: ThemeConfig }>()
const lucideRef = ref(true)
const presetCode = computed(() => encodeThemePreset(props.theme))
const css = computed(() => generateThemeCss(props.theme))
const styleGuide = computed(() => createStyleGuidePrompt(props.theme, lucideRef.value))
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

// Your component imports stay the same:
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
      <CodeBlock :code="presetCode" :label="t('Preset code')" />
      <Tabs default-value="install" class="min-w-0">
        <TabsList
          ><TabsTrigger value="install">{{ t('Install') }}</TabsTrigger
          ><TabsTrigger value="css">CSS</TabsTrigger
          ><TabsTrigger value="ai"
            ><Bot class="size-4" aria-hidden="true" />{{ t('AI guide') }}</TabsTrigger
          ></TabsList
        >
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
          <div class="flex flex-col gap-3">
            <p class="text-sm text-muted-foreground">
              {{ t('Run in your project to apply this theme.') }}
            </p>
            <CodeBlock :code="install" label="pnpm" />
            <CodeBlock v-if="lucideRef" :code="icons" label="vite.config.ts / icons" />
          </div>
          <p class="rounded-lg border bg-muted/50 p-3 text-xs leading-6 text-muted-foreground">
            {{
              t('Custom fonts use system fallbacks on WeChat unless you load the font yourself.')
            }}
          </p>
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
        <TabsContent value="ai" class="flex flex-col gap-4 pt-3">
          <p class="text-sm leading-6 text-muted-foreground">
            {{
              t(
                'Paste this into your coding agent. It saves UI_STYLE_GUIDE.md and references it from AGENTS.md, so future pages follow your theme and shared components.',
              )
            }}
          </p>
          <Textarea
            :model-value="styleGuide"
            :aria-label="t('AI style instructions')"
            readonly
            class="field-sizing-fixed h-72 resize-none font-mono text-xs leading-6"
          />
          <Button @click="copyText(styleGuide)"><Copy />{{ t('Copy for AI') }}</Button>
          <p class="text-xs leading-5 text-muted-foreground">
            {{
              t(
                'Includes your selected preset and icon choice. Existing project rules are preserved.',
              )
            }}
          </p>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>

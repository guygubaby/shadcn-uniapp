<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { computed, ref } from 'vue'
import { Download, Sparkles } from '@lucide/vue'
import { generateThemeCss } from 'shadcn-uniapp'
import type { ThemeConfig } from 'shadcn-uniapp'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import CodeBlock from '@/components/CodeBlock.vue'
import { downloadText } from '@/lib/browser'

const { t } = useI18n()
const openRef = defineModel<boolean>('open', { default: false })
const props = defineProps<{ theme: ThemeConfig }>()
const lucideRef = ref(true)
const json = computed(() => JSON.stringify(props.theme, null, 2) + '\n')
const css = computed(() => generateThemeCss(props.theme))
const install = computed(() =>
  [
    'pnpm add -D shadcn-uniapp sass',
    ...(lucideRef.value ? ['pnpm add @lucide/vue'] : []),
    'pnpm exec shadcn-uniapp init --theme ./shadcn.theme.json',
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
      <Tabs default-value="install" class="min-w-0">
        <TabsList
          ><TabsTrigger value="install">{{ t('Install') }}</TabsTrigger
          ><TabsTrigger value="css">CSS</TabsTrigger
          ><TabsTrigger value="json">JSON</TabsTrigger></TabsList
        >
        <TabsContent value="install" class="flex flex-col gap-5 pt-3">
          <div
            class="flex items-center justify-between gap-4 rounded-md border border-accent/20 bg-accent/5 p-4"
          >
            <div class="min-w-0 space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <Label for="export-lucide">{{ t('Use Lucide icons') }}</Label>
                <Badge variant="outline" class="border-accent/20 bg-accent/10 text-accent"
                  ><Sparkles aria-hidden="true" />{{ t('Recommended') }}</Badge
                >
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
            <p class="text-sm">
              <span class="mr-2 text-muted-foreground">1.</span>
              {{ t('Download your config into your project root.') }}
            </p>
            <Button
              variant="outline"
              class="self-start"
              @click="downloadText('shadcn.theme.json', json, 'application/json')"
              ><Download />{{ t('Download theme JSON') }}</Button
            >
          </div>
          <div class="flex flex-col gap-3">
            <p class="text-sm">
              <span class="mr-2 text-muted-foreground">2.</span>
              {{ t('Initialize the theme in your Wot project.') }}
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
          <Button
            variant="outline"
            class="self-start"
            @click="downloadText(`${theme.name}.scss`, css)"
            ><Download />{{ t('Download SCSS') }}</Button
          ></TabsContent
        >
        <TabsContent value="json" class="flex flex-col gap-3 pt-3"
          ><div class="max-h-80 overflow-auto">
            <CodeBlock :code="json" label="shadcn.theme.json" />
          </div>
          <Button
            variant="outline"
            class="self-start"
            @click="downloadText('shadcn.theme.json', json, 'application/json')"
            ><Download />{{ t('Download JSON') }}</Button
          ></TabsContent
        >
      </Tabs>
    </DialogContent>
  </Dialog>
</template>

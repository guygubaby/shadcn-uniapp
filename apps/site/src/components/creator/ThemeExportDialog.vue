<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { computed } from 'vue'
import { Download } from '@lucide/vue'
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
import CodeBlock from '@/components/CodeBlock.vue'
import { downloadText } from '@/lib/browser'

const { t } = useI18n()
const openRef = defineModel<boolean>('open', { default: false })
const props = defineProps<{ theme: ThemeConfig }>()
const json = computed(() => JSON.stringify(props.theme, null, 2) + '\n')
const css = computed(() => generateThemeCss(props.theme))
const install =
  'pnpm add -D shadcn-uniapp sass\npnpm add @lucide/vue\npnpm exec shadcn-uniapp init --theme ./shadcn.theme.json'
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
          </div>
          <p class="rounded-lg border bg-muted/50 p-3 text-xs leading-6 text-muted-foreground">
            {{
              t(
                'The npm package is not published yet. Until the release, use the built local CLI described in the docs. Custom fonts use system fallbacks on WeChat unless you load the font yourself.',
              )
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

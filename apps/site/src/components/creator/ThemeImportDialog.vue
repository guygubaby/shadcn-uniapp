<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { ref, useTemplateRef } from 'vue'
import { Upload } from '@lucide/vue'
import { parseTheme } from 'shadcn-uniapp'
import type { ThemeConfig } from 'shadcn-uniapp'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'


const { t } = useI18n()
const openRef = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ apply: [theme: ThemeConfig] }>()
const textRef = ref('')
const errorRef = ref('')
const fileRef = useTemplateRef<HTMLInputElement>('preset-file')
function load(text: string) {
  try {
    if (text.length > 256 * 1024) throw new Error('Too large')
    let data = text.trim()
    if (/^https?:\/\//.test(data)) {
      const theme = new URL(data).searchParams.get('theme')
      if (!theme || theme.length > 4096) throw new Error('Invalid link')
      data = atob(theme)
    }
    emit('apply', parseTheme(JSON.parse(data)))
    openRef.value = false
    textRef.value = ''
    errorRef.value = ''
  } catch {
    errorRef.value =
      'Use an exported shadcn-uniapp JSON theme or share link. Wot v2 themes only; maximum 256 KiB.'
  }
}
async function upload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    try {
      if (file.size > 256 * 1024) throw new Error('Too large')
      load(await file.text())
    } catch {
      errorRef.value = 'Could not read this file. Choose a theme JSON smaller than 256 KiB.'
    }
  }
  input.value = ''
}
</script>

<template>
  <Dialog v-model:open="openRef">
    <DialogContent class="sm:max-w-xl">
      <DialogHeader
        ><DialogTitle>{{ t('Open a preset') }}</DialogTitle
        ><DialogDescription>{{
          t('Paste a shared theme URL or exported JSON. Everything stays in your browser.')
        }}</DialogDescription></DialogHeader
      >
      <div class="flex flex-col gap-3">
        <Label for="preset-text">{{ t('Theme URL or JSON') }}</Label
        ><Textarea
          id="preset-text"
          v-model="textRef"
          class="min-h-44 font-mono text-xs"
          placeholder="https://shadcn-uniapp.guygubaby.top/create?theme=..."
          :aria-invalid="!!errorRef"
          :aria-describedby="errorRef ? 'preset-error' : undefined"
        />
        <p
          v-if="errorRef"
          id="preset-error"
          role="alert"
          class="text-xs leading-6 text-destructive"
        >
          {{ t(errorRef) }}
        </p>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <input
          ref="preset-file"
          type="file"
          accept=".json,application/json"
          class="hidden"
          :aria-label="t('Upload a theme JSON')"
          @change="upload"
        /><Button variant="outline" @click="fileRef?.click()"
          ><Upload />{{ t('Upload JSON') }}</Button
        ><Button :disabled="!textRef.trim()" @click="load(textRef)">{{ t('Open preset') }}</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

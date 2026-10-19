<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { ref } from 'vue'
import { decodeThemePreset } from 'shadcn-uniapp'
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
import { Input } from '@/components/ui/input'

const { t } = useI18n()
const openRef = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ apply: [theme: ThemeConfig] }>()
const textRef = ref('')
const errorRef = ref('')
function load() {
  try {
    emit('apply', decodeThemePreset(textRef.value.trim()))
    openRef.value = false
    textRef.value = ''
    errorRef.value = ''
  } catch {
    errorRef.value = 'Enter a valid preset code from Creator.'
  }
}
</script>

<template>
  <Dialog v-model:open="openRef">
    <DialogContent class="sm:max-w-xl">
      <DialogHeader
        ><DialogTitle>{{ t('Open a preset') }}</DialogTitle
        ><DialogDescription>{{
          t('Paste a preset code to restore all theme settings.')
        }}</DialogDescription></DialogHeader
      >
      <form class="flex flex-col gap-3" @submit.prevent="load">
        <Label for="preset-text">{{ t('Preset code') }}</Label
        ><Input
          id="preset-text"
          v-model="textRef"
          class="font-mono text-sm"
          autocomplete="off"
          autocapitalize="none"
          :spellcheck="false"
          placeholder="su1-820"
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
        <Button type="submit" class="self-end" :disabled="!textRef.trim()">{{
          t('Open preset')
        }}</Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

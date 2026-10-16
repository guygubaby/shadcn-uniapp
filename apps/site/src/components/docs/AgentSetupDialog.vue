<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bot, Copy } from '@lucide/vue'
import { useI18n } from '@/lib/i18n'
import { copyText } from '@/lib/browser'
import { createAgentSetupPrompt, type SetupStyling } from '@/lib/agent-setup'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const { t, localeRef } = useI18n()
const stylingRef = ref<SetupStyling>('preserve')
const lucideRef = ref(true)
const prompt = computed(() =>
  createAgentSetupPrompt({ styling: stylingRef.value, lucide: lucideRef.value }, localeRef.value),
)
const choices = [
  {
    value: 'preserve',
    label: 'Keep existing setup',
    description: 'Recommended for existing projects, including UnoCSS.',
  },
  {
    value: 'tailwind',
    label: 'Tailwind CSS v4',
    description: 'Use weapp-tailwindcss for uni-app targets.',
  },
  {
    value: 'unocss',
    label: 'UnoCSS',
    description: 'Use compatible uni-app presets and preserve existing versions.',
  },
] as const
</script>

<template>
  <Dialog>
    <DialogTrigger as-child
      ><Button variant="outline"><Bot />{{ t('Set up with an AI agent') }}</Button></DialogTrigger
    >
    <DialogContent class="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{{ t('Set up with an AI agent') }}</DialogTitle>
        <DialogDescription>{{
          t(
            'Choose your setup, then paste the instructions into your coding agent in the target project.',
          )
        }}</DialogDescription>
      </DialogHeader>
      <fieldset class="grid gap-3">
        <legend class="mb-3 text-sm font-medium">{{ t('Styling system') }}</legend>
        <label
          v-for="choice in choices"
          :key="choice.value"
          class="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors has-checked:border-foreground/40 has-checked:bg-muted"
        >
          <input
            v-model="stylingRef"
            type="radio"
            name="agent-styling"
            :value="choice.value"
            class="mt-1 size-4 shrink-0 accent-foreground"
          />
          <span class="grid gap-1"
            ><span class="text-sm font-medium">{{ t(choice.label) }}</span
            ><span class="text-xs leading-5 text-muted-foreground">{{
              t(choice.description)
            }}</span></span
          >
        </label>
      </fieldset>
      <div class="flex items-center justify-between gap-4 rounded-md border p-3">
        <div class="grid gap-1">
          <Label for="agent-lucide">{{ t('Use Lucide icons') }}</Label>
          <p class="text-xs leading-5 text-muted-foreground">
            {{ t('Automatically adapt named imports with the Vite 5 plugin.') }}
          </p>
        </div>
        <Switch id="agent-lucide" v-model="lucideRef" />
      </div>
      <Label for="agent-instructions">{{ t('Agent instructions') }}</Label>
      <Textarea
        id="agent-instructions"
        :model-value="prompt"
        readonly
        class="field-sizing-fixed h-56 resize-none font-mono text-xs"
      />
      <Button @click="copyText(prompt)"><Copy />{{ t('Copy agent instructions') }}</Button>
    </DialogContent>
  </Dialog>
</template>

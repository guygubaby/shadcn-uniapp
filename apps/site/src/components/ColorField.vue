<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { computed, ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


const { t } = useI18n()
const props = defineProps<{ id: string; label: string; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const draftRef = ref(props.modelValue)
const valid = computed(() => /^#[\da-f]{6}$/i.test(draftRef.value))
watch(
  () => props.modelValue,
  (value) => {
    draftRef.value = value
  },
)
function update(value: string | number) {
  draftRef.value = String(value)
  if (valid.value) emit('update:modelValue', draftRef.value)
}
</script>

<template>
  <div class="grid gap-2">
    <Label :for="id" class="text-xs font-medium">{{ t(label) }}</Label>
    <div class="flex items-center gap-2">
      <input
        type="color"
        :value="modelValue"
        :aria-label="t(`${label} color picker`)"
        class="size-9 shrink-0 cursor-pointer rounded-md border bg-background p-1"
        @input="update(($event.target as HTMLInputElement).value)"
      />
      <Input
        :id="id"
        :model-value="draftRef"
        :aria-invalid="!valid"
        :aria-describedby="!valid ? `${id}-error` : undefined"
        class="min-w-0 font-mono text-xs"
        spellcheck="false"
        @update:model-value="update"
      />
    </div>
    <p v-if="!valid" :id="`${id}-error`" class="text-xs text-destructive">
      {{ t('Enter a six-digit hex color.') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { Check, ChevronDown, LockKeyhole, UnlockKeyhole } from '@lucide/vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { PickerOption } from './options'

const props = defineProps<{
  label: string
  value: string
  options: PickerOption[]
  locked: boolean
  kind?: 'color' | 'font' | 'radius' | 'style'
}>()
const emit = defineEmits<{ select: [value: string]; lock: [] }>()
const openRef = ref(false)
const id = useId()
const selected = computed(() => props.options.find((option) => option.value === props.value))
function choose(value: string) {
  emit('select', value)
  openRef.value = false
}
</script>

<template>
  <div class="group/picker relative">
    <Popover v-model:open="openRef">
      <PopoverTrigger as-child>
        <button
          class="creator-picker flex min-h-16 w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-colors"
          :aria-label="`${label}: ${selected?.label ?? 'Custom'}`"
        >
          <span class="min-w-0"
            ><span class="block text-xs text-white/50">{{ label }}</span
            ><span class="mt-0.5 block truncate text-sm font-medium">{{
              selected?.label ?? 'Custom'
            }}</span></span
          >
          <span
            v-if="kind === 'color'"
            class="size-4 shrink-0 rounded-full border border-white/20"
            :style="{ backgroundColor: selected?.color ?? '#737373' }"
          />
          <span
            v-else-if="kind === 'font'"
            class="text-lg text-white/45"
            :class="value === 'mono' && 'font-mono'"
            >Aa</span
          >
          <span
            v-else-if="kind === 'radius'"
            class="size-4 border-t border-l border-white/45"
            :style="{ borderTopLeftRadius: `${Math.min(Number(value) || 0, 12)}px` }"
          />
          <ChevronDown v-else class="size-3.5 text-white/40" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" :side-offset="12" class="w-80 p-2">
        <p class="px-2 py-2 text-xs font-medium text-muted-foreground">{{ label }}</p>
        <div class="grid grid-cols-2 gap-1">
          <label
            v-for="option in options"
            :key="option.value"
            :class="
              cn(
                'relative flex cursor-pointer items-center gap-2.5 rounded-lg border border-transparent px-3 py-3 text-sm hover:bg-muted has-focus-visible:ring-2 has-focus-visible:ring-ring',
                value === option.value && 'border-border bg-muted',
              )
            "
          >
            <input
              :name="id"
              type="radio"
              class="sr-only"
              :value="option.value"
              :checked="value === option.value"
              @change="choose(option.value)"
            />
            <span
              v-if="option.color"
              class="size-4 shrink-0 rounded-full border"
              :style="{ backgroundColor: option.color }"
            />
            <span class="min-w-0"
              ><span class="block text-sm font-medium">{{ option.label }}</span
              ><span
                v-if="option.description"
                class="mt-1 block text-xs leading-5 text-muted-foreground"
                >{{ option.description }}</span
              ></span
            >
            <Check v-if="value === option.value" class="ml-auto size-3.5 shrink-0" />
          </label>
        </div>
      </PopoverContent>
    </Popover>
    <button
      :class="
        cn(
          'creator-lock absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-md border opacity-0 transition-opacity group-hover/picker:opacity-100 focus:opacity-100 max-lg:opacity-100',
          locked && 'opacity-100',
        )
      "
      :aria-label="`${locked ? 'Unlock' : 'Lock'} ${label.toLowerCase()}`"
      :aria-pressed="locked"
      @click="emit('lock')"
    >
      <LockKeyhole v-if="locked" class="size-3" /><UnlockKeyhole v-else class="size-3" />
    </button>
  </div>
</template>

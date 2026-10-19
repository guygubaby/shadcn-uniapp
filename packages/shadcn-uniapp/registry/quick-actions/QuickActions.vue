<script setup lang="ts">
import { inject } from 'vue'
import { CalendarDays, FileText, Mail, Pencil, UserRound, LayoutGrid } from '@lucide/vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{ actions: { id: string; title: string; icon: string }[] }>()
defineEmits<{ select: [id: string] }>()
</script>
<template>
  <view class="flex flex-wrap gap-2">
    <button
      v-for="action in actions"
      :key="action.id"
      :aria-label="t(action.title)"
      role="button"
      tabindex="0"
      class="m-0 flex min-h-20 min-w-0 grow basis-24 flex-col items-center justify-center gap-2 rounded-[var(--sui-radius)] border border-solid border-[var(--sui-border)] bg-[var(--sui-card)] px-2 py-2 text-[var(--sui-foreground)] transition-colors after:border-0 hover:bg-[var(--sui-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sui-primary)] motion-reduce:transition-none"
      hover-class="opacity-80"
      @click="$emit('select', action.id)"
      @keydown.enter.prevent="$emit('select', action.id)"
      @keydown.space.prevent="$emit('select', action.id)"
    >
      <view
        class="flex size-8 shrink-0 items-center justify-center rounded-[var(--sui-radius)] bg-[var(--sui-muted)] text-[var(--sui-muted-foreground)]"
      >
        <CalendarDays v-if="action.icon === 'calendar-line'" :size="20" />
        <FileText v-else-if="action.icon === 'file'" :size="20" />
        <Mail v-else-if="action.icon === 'email'" :size="20" />
        <Pencil v-else-if="action.icon === 'edit'" :size="20" />
        <UserRound v-else-if="action.icon === 'user'" :size="20" />
        <LayoutGrid v-else :size="20" />
      </view>
      <text class="max-w-full text-xs leading-5 font-medium">{{ t(action.title) }}</text>
    </button>
  </view>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import CalendarDays from './CalendarDays.vue'
import FileText from './FileText.vue'
import Mail from './Mail.vue'
import Pencil from './Pencil.vue'
import UserRound from './UserRound.vue'
import LayoutGrid from './LayoutGrid.vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{ actions: { id: string; title: string; icon: string }[] }>()
defineEmits<{ select: [id: string] }>()
</script>
<template>
  <wd-grid :column="3" clickable>
    <wd-grid-item
      v-for="action in actions"
      :key="action.id"
      :text="t(action.title)"
      @click="$emit('select', action.id)"
    >
      <template #icon>
        <CalendarDays v-if="action.icon === 'calendar-line'" :size="28" />
        <FileText v-else-if="action.icon === 'file'" :size="28" />
        <Mail v-else-if="action.icon === 'email'" :size="28" />
        <Pencil v-else-if="action.icon === 'edit'" :size="28" />
        <UserRound v-else-if="action.icon === 'user'" :size="28" />
        <LayoutGrid v-else :size="28" />
      </template>
    </wd-grid-item>
  </wd-grid>
</template>

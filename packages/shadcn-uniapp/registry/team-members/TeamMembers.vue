<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{ members: { id: string; name: string; role: string; initials: string }[] }>()
defineEmits<{ invite: []; manage: [id: string] }>()
</script>
<template>
  <view
    v-for="member in members"
    :key="member.id"
    style="display: flex; align-items: center; gap: 12px; margin-bottom: 18px"
  >
    <wd-avatar :text="t(member.initials)" :size="38" />
    <view style="flex: 1; min-width: 0"
      ><text style="display: block; font-weight: 600">{{ t(member.name) }}</text
      ><wd-text :text="t(member.role)" color="var(--sui-muted-foreground)"
    /></view>
    <wd-button size="small" variant="plain" @click="$emit('manage', member.id)">{{
      t('Manage')
    }}</wd-button>
  </view>
  <wd-button block @click="$emit('invite')">{{ t('Invite member') }}</wd-button>
</template>

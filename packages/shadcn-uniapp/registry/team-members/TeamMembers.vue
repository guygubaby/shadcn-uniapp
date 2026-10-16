<script setup lang="ts">
import { inject } from 'vue'
const t = inject<(text: unknown) => string>('shadcn-uniapp:translate', (text) => String(text ?? ''))

defineProps<{ members: { id: string; name: string; role: string; initials: string }[] }>()
defineEmits<{ invite: []; manage: [id: string] }>()
</script>
<template>
  <view v-for="member in members" :key="member.id" class="mb-4.5 flex items-center gap-3">
    <wd-avatar :text="t(member.initials)" :size="38" />
    <view class="min-w-0 flex-1"
      ><text class="block font-semibold">{{ t(member.name) }}</text
      ><wd-text :text="t(member.role)" color="var(--sui-muted-foreground)"
    /></view>
    <wd-button size="small" variant="plain" @click="$emit('manage', member.id)">{{
      t('Manage')
    }}</wd-button>
  </view>
  <wd-button block @click="$emit('invite')">{{ t('Invite member') }}</wd-button>
</template>

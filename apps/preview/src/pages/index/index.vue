<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { createPreset, getThemeVariables, getWotThemeVars, themeSchema } from 'shadcn-uniapp'
import type { ThemeMode } from 'shadcn-uniapp'
import ProfileCard from '../../blocks/profile-card/ProfileCard.vue'
import SettingsForm from '../../blocks/settings-form/SettingsForm.vue'
import FilterList from '../../blocks/filter-list/FilterList.vue'
import OverviewBoard from '../../components/gallery/OverviewBoard.vue'
import ComponentGallery from '../../components/gallery/ComponentGallery.vue'
import { useConfigProvider } from '@wot-ui/ui'

const themeRef = shallowRef(createPreset())
const modeRef = ref<ThemeMode>('light')
const blockRef = ref('components')
const canvasRef = ref(false)
const popupRef = ref(false)
const valueRef = ref('Bryce')
const checkedRef = ref(true)
const noticeRef = ref('')
const wotVars = computed(() => getWotThemeVars(themeRef.value, modeRef.value))
useConfigProvider({ theme: modeRef, themeVars: wotVars })
const style = computed(() => ({
  ...getThemeVariables(themeRef.value, modeRef.value),
  backgroundColor: themeRef.value[modeRef.value].background,
  color: themeRef.value[modeRef.value].foreground,
  minHeight: '100vh',
  padding: canvasRef.value ? '0' : '20px',
  fontFamily: getThemeVariables(themeRef.value, modeRef.value)['--sui-font-body'],
  boxSizing: 'border-box' as const,
}))
const items = [
  {
    id: 'theme',
    title: 'Brand themes',
    description: 'A consistent look for your existing Wot components',
  },
  { id: 'creator', title: 'Theme Creator', description: 'Edit, check, and export your theme' },
  {
    id: 'blocks',
    title: 'Source-owned blocks',
    description: 'Add to your project and make them yours',
  },
]

// #ifdef H5
function receive(event: MessageEvent) {
  if (event.origin !== window.location.origin || event.source !== window.parent) return
  const data = event.data
  if (!data || data.type !== 'shadcn-uniapp:theme') return
  const result = themeSchema.safeParse(data.theme)
  if (!result.success || !['light', 'dark'].includes(data.mode)) return
  if (
    !['components', 'catalog', 'profile-card', 'settings-form', 'filter-list'].includes(data.block)
  )
    return
  themeRef.value = result.data
  modeRef.value = data.mode
  blockRef.value = data.block
  canvasRef.value = data.canvas === true
  document.documentElement.style.colorScheme = data.mode
  for (const [key, value] of Object.entries(getThemeVariables(result.data, data.mode))) {
    document.documentElement.style.setProperty(key, value)
  }
}

onMounted(() => {
  window.addEventListener('message', receive)
  window.parent.postMessage({ type: 'shadcn-uniapp:ready' }, window.location.origin)
})
onUnmounted(() => window.removeEventListener('message', receive))
// #endif
</script>

<template>
  <wd-config-provider :theme="modeRef" :theme-vars="wotVars">
    <view :style="style">
      <view v-if="!canvasRef" style="margin-bottom: 24px">
        <text style="display: block; font-size: 22px; font-weight: 600">Your next interface</text>
        <text
          style="
            display: block;
            margin-top: 8px;
            font-size: 13px;
            color: var(--sui-muted-foreground);
          "
          >Same Wot components. A fresh expression.</text
        >
      </view>

      <OverviewBoard v-if="blockRef === 'components' && canvasRef" />
      <ComponentGallery v-else-if="blockRef === 'catalog'" />
      <template v-else-if="blockRef === 'components'">
        <wd-cell-group border>
          <wd-cell title="Workspace" value="Personal" is-link @click="popupRef = true" />
          <wd-cell title="Notifications">
            <wd-switch v-model="checkedRef" aria-label="Notifications" />
          </wd-cell>
        </wd-cell-group>
        <view style="margin-top: 24px">
          <wd-form-item title="Display name">
            <wd-input v-model="valueRef" placeholder="Enter a display name" />
          </wd-form-item>
        </view>
        <view style="display: flex; gap: 10px; margin-top: 24px">
          <wd-button type="primary" @click="popupRef = true">Open overlay</wd-button>
          <wd-button type="primary" variant="plain" @click="noticeRef = 'Action cancelled'"
            >Cancel</wd-button
          >
        </view>
        <view style="display: flex; gap: 10px; margin-top: 14px">
          <wd-tag type="primary" variant="light">Synced</wd-tag>
          <wd-tag type="danger" variant="plain">Destructive</wd-tag>
        </view>
        <view style="margin-top: 24px">
          <ProfileCard
            :name="valueRef || 'Bryce'"
            description="Design & Development"
            @edit="popupRef = true"
          />
        </view>
      </template>
      <ProfileCard
        v-else-if="blockRef === 'profile-card'"
        name="Bryce"
        description="Design & Development"
        @edit="popupRef = true"
      />
      <SettingsForm
        v-else-if="blockRef === 'settings-form'"
        email="hello@example.com"
        @save="noticeRef = `Validated locally: ${$event.email} (not sent to a server)`"
      />
      <FilterList v-else :items="items" @select="noticeRef = `Selected: ${$event}`" />
      <text
        v-if="noticeRef"
        role="status"
        style="display: block; margin-top: 16px; font-size: 13px"
        >{{ noticeRef }}</text
      >

      <wd-popup v-model="popupRef" position="bottom" round root-portal>
        <view style="padding: 28px 20px 36px">
          <text style="display: block; font-size: 18px; font-weight: 600"
            >Your theme, everywhere</text
          >
          <text style="display: block; margin: 14px 0 24px; font-size: 14px"
            >A real Wot Popup, mounted at the page root through RootPortal.</text
          >
          <wd-button type="primary" block @click="popupRef = false">Done</wd-button>
        </view>
      </wd-popup>
    </view>
  </wd-config-provider>
</template>

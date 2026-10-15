<script setup lang="ts">
import { computed, provide, watch, onMounted, onUnmounted, ref, shallowRef } from 'vue'
import {
  blocks,
  translate,
  createPreset,
  getThemeVariables,
  getWotThemeVars,
  themeSchema,
} from 'shadcn-uniapp'
import type { UiLocale, ThemeMode } from 'shadcn-uniapp'
import { previewColorsKey } from '../../theme'
import ProfileCard from '../../blocks/profile-card/ProfileCard.vue'
import BlockPreview from '../../components/gallery/BlockPreview.vue'
import OverviewBoard from '../../components/gallery/OverviewBoard.vue'
import ComponentGallery from '../../components/gallery/ComponentGallery.vue'
import enUS from '@wot-ui/ui/locale/lang/en-US'
import zhCN from '@wot-ui/ui/locale/lang/zh-CN'
import { Locale, useConfigProvider } from '@wot-ui/ui'

const localeRef = ref<UiLocale>('zh-CN')
const t = (text: unknown) => translate(text, localeRef.value)
provide('shadcn-uniapp:translate', t)
watch(
  localeRef,
  (locale) => {
    Locale.use(locale, locale === 'zh-CN' ? zhCN : enUS)
    // #ifdef H5
    document.documentElement.lang = locale
    // #endif
  },
  { immediate: true },
)
const themeRef = shallowRef(createPreset())
const modeRef = ref<ThemeMode>('light')
provide(
  previewColorsKey,
  computed(() => themeRef.value[modeRef.value]),
)
const blockRef = ref('components')
const canvasRef = ref(false)
// #ifdef MP-WEIXIN
blockRef.value = 'catalog'
// #endif
const popupRef = ref(false)
const valueRef = ref('Bryce')
const checkedRef = ref(true)
const noticeRef = ref('')
const wotVars = computed(() => getWotThemeVars(themeRef.value, modeRef.value))
useConfigProvider({ theme: modeRef, themeVars: wotVars })
const style = computed(() => ({
  ...getThemeVariables(themeRef.value, modeRef.value),
  backgroundColor: canvasRef.value
    ? themeRef.value[modeRef.value].muted
    : themeRef.value[modeRef.value].background,
  color: themeRef.value[modeRef.value].foreground,
  minHeight: '100vh',
  padding: canvasRef.value ? 'clamp(16px, 2.5vw, 32px)' : '20px',
  fontFamily: getThemeVariables(themeRef.value, modeRef.value)['--sui-font-body'],
  boxSizing: 'border-box' as const,
}))
// #ifdef H5
function receive(event: MessageEvent) {
  if (event.origin !== window.location.origin || event.source !== window.parent) return
  const data = event.data
  if (!data || data.type !== 'shadcn-uniapp:theme') return
  const result = themeSchema.safeParse(data.theme)
  if (!result.success || !['light', 'dark'].includes(data.mode)) return
  if (
    !['components', 'catalog'].includes(data.block) &&
    !blocks.some((block) => block.name === data.block)
  )
    return
  localeRef.value = data.locale === 'en-US' ? 'en-US' : 'zh-CN'
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
      <!-- #ifdef MP-WEIXIN -->
      <view style="margin-bottom: 20px">
        <wd-button
          size="small"
          variant="plain"
          @click="modeRef = modeRef === 'light' ? 'dark' : 'light'"
        >
          {{ t(modeRef === 'light' ? 'Use dark theme' : 'Use light theme') }}
        </wd-button>
      </view>
      <!-- #endif -->
      <view v-if="!canvasRef && blockRef !== 'catalog'" style="margin-bottom: 24px">
        <text style="display: block; font-size: 22px; font-weight: 600">{{
          t('Your next interface')
        }}</text>
        <text
          style="
            display: block;
            margin-top: 8px;
            font-size: 13px;
            color: var(--sui-muted-foreground);
          "
          >{{ t('Same Wot components. A fresh expression.') }}</text
        >
      </view>

      <template v-if="blockRef === 'components' && canvasRef">
        <OverviewBoard />
        <ComponentGallery expanded />
      </template>
      <ComponentGallery v-else-if="blockRef === 'catalog'" />
      <template v-else-if="blockRef === 'components'">
        <wd-cell-group border>
          <wd-cell :title="t('Workspace')" value="Personal" is-link @click="popupRef = true" />
          <wd-cell :title="t('Notifications')">
            <wd-switch v-model="checkedRef" :aria-label="t('Notifications')" />
          </wd-cell>
        </wd-cell-group>
        <view style="margin-top: 24px">
          <wd-form-item :title="t('Display name')">
            <wd-input v-model="valueRef" :placeholder="t('Enter a display name')" />
          </wd-form-item>
        </view>
        <view style="display: flex; gap: 10px; margin-top: 24px">
          <wd-button type="primary" @click="popupRef = true">{{ t('Open overlay') }}</wd-button>
          <wd-button type="primary" variant="plain" @click="noticeRef = 'Action cancelled'">{{
            t('Cancel')
          }}</wd-button>
        </view>
        <view style="display: flex; gap: 10px; margin-top: 14px">
          <wd-tag type="primary" variant="light">{{ t('Synced') }}</wd-tag>
          <wd-tag type="danger" variant="plain">{{ t('Destructive') }}</wd-tag>
        </view>
        <view style="margin-top: 24px">
          <ProfileCard
            :name="valueRef || 'Bryce'"
            :description="t('Design & Development')"
            @edit="popupRef = true"
          />
        </view>
      </template>
      <BlockPreview v-else :key="blockRef" :block="blockRef" @notice="noticeRef = $event" />
      <text
        v-if="noticeRef"
        role="status"
        style="display: block; margin-top: 16px; font-size: 13px"
        >{{ t(noticeRef) }}</text
      >

      <wd-popup v-model="popupRef" position="bottom" round root-portal>
        <view style="padding: 28px 20px 36px">
          <text style="display: block; font-size: 18px; font-weight: 600">{{
            t('Your theme, everywhere')
          }}</text>
          <text style="display: block; margin: 14px 0 24px; font-size: 14px">{{
            t('A real Wot Popup, mounted at the page root through RootPortal.')
          }}</text>
          <wd-button type="primary" block @click="popupRef = false">{{ t('Done') }}</wd-button>
        </view>
      </wd-popup>
    </view>
  </wd-config-provider>
</template>

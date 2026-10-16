<script setup lang="ts">
import { usePreviewI18n } from '../../../i18n'

import { inject, ref, shallowRef } from 'vue'
import { useToast } from '@wot-ui/ui'
import { previewColorsKey } from '../../../theme'
import GallerySection from '../GallerySection.vue'
import { Lightbulb, Headphones, CalendarDays } from '@lucide/vue'

const { t } = usePreviewI18n()
const colorsRef = inject(previewColorsKey)!
const toast = useToast('layouts')
const lightRef = ref(true)
const sceneRef = ref('Focus')
const brightnessRef = ref(80)
const volumeRef = ref(40)
const playingRef = ref(false)
const dateRef = ref(new Date(2026, 9, 15).getTime())
const guestsRef = ref(2)
const ratingRef = ref(4)
const reviewRef = ref('')
const accessEmailRef = ref('')
const sessionsRef = shallowRef(['design'])
const dates = { min: new Date(2026, 9, 1).getTime(), max: new Date(2026, 9, 31).getTime() }
</script>
<template>
  <GallerySection :title="t('Set the mood')" :description="t('Living room · Your favorite corner')">
    <view class="layout-between"
      ><view class="gallery-inline"
        ><Lightbulb :size="30" /><text class="overview-person-name">{{
          t('Ambient lighting')
        }}</text></view
      ><wd-switch v-model="lightRef"
    /></view>
    <wd-segmented
      v-model:value="sceneRef"
      :options="[
        { label: t('Focus'), value: 'Focus' },
        { label: t('Relax'), value: 'Relax' },
        { label: t('Evening'), value: 'Evening' },
      ]"
      ><template #label="{ option }">{{ t(option.value) }}</template></wd-segmented
    >
    <view class="layout-between"
      ><text class="gallery-description">{{ t('Brightness') }}</text
      ><text class="layout-value">{{ t(brightnessRef) }}%</text></view
    ><wd-slider v-model="brightnessRef" :disabled="!lightRef" />
    <text class="gallery-description">{{
      t(lightRef ? `${sceneRef} scene is on.` : 'Lights are off.')
    }}</text>
  </GallerySection>
  <GallerySection
    :title="t('A little more green')"
    :description="t('Your home energy, at a glance.')"
  >
    <view class="layout-between"
      ><view
        ><text class="gallery-description">{{ t('Currently using') }}</text
        ><text class="overview-metric">{{ t('3.4 kW') }}</text></view
      ><!-- Circle does not watch layerColor; remount when the track color changes. -->
      <wd-circle
        :key="colorsRef.muted"
        :color="colorsRef.primary"
        :layer-color="colorsRef.muted"
        :model-value="85"
        :size="92"
        text="85%"
    /></view>
    <view class="gallery-surface layout-between"
      ><text>{{ t('Solar generation') }}</text
      ><wd-tag type="success" variant="light">{{ t('+1.2 kW') }}</wd-tag></view
    >
    <wd-progress :percentage="72" /><text class="gallery-description">{{
      t("72% of today's energy came from renewable sources.")
    }}</text>
  </GallerySection>
  <GallerySection :title="t('Now playing')" :description="t('A soundtrack for your next idea.')">
    <view class="music-art"><Headphones :size="56" /></view>
    <view class="layout-between"
      ><view
        ><text class="overview-person-name">{{ t('Quiet mornings') }}</text
        ><text class="gallery-description">{{ t('Studio sessions · Vol. 04') }}</text></view
      ><wd-tag variant="plain">{{ t('Lo-fi') }}</wd-tag></view
    >
    <wd-progress :percentage="38" :hide-text="true" /><view
      class="layout-between gallery-description"
      ><text>1:24</text><text>3:42</text></view
    >
    <wd-button block :variant="playingRef ? 'plain' : 'base'" @click="playingRef = !playingRef">{{
      t(playingRef ? 'Pause playback' : 'Play preview')
    }}</wd-button>
    <wd-form-item :title="t('Volume')"><wd-slider v-model="volumeRef" /></wd-form-item>
  </GallerySection>
  <GallerySection
    :title="t('Make a little time')"
    :description="t('Find a date for your next good conversation.')"
  >
    <wd-calendar-view
      v-model="dateRef"
      :min-date="dates.min"
      :max-date="dates.max"
      :panel-height="310"
    />
    <wd-cell :title="t('Guests')"
      ><wd-input-number v-model="guestsRef" :min="1" :max="8"
    /></wd-cell>
    <wd-button block @click="toast.success(`Demo booking for ${guestsRef} guests selected.`)">{{
      t('Reserve a time')
    }}</wd-button>
  </GallerySection>
  <GallerySection
    :title="t('Your next workshop')"
    :description="t('Design systems, from the inside out.')"
  >
    <view class="layout-between"
      ><wd-tag type="primary" variant="light">{{ t('Oct 24 · 10:00 AM') }}</wd-tag
      ><CalendarDays :size="24"
    /></view>
    <text class="gallery-description">{{
      t('A hands-on session on the small details that make an interface feel right.')
    }}</text>
    <wd-checkbox-group v-model="sessionsRef" shape="square"
      ><wd-checkbox name="design">{{ t('Design tokens & theming') }}</wd-checkbox
      ><wd-checkbox name="motion">{{ t('Thoughtful motion') }}</wd-checkbox
      ><wd-checkbox name="accessibility">{{
        t('Accessible by default')
      }}</wd-checkbox></wd-checkbox-group
    >
    <view class="overview-person"
      ><wd-avatar-group :max-count="3"
        ><wd-avatar :text="t('AM')" :size="30" /><wd-avatar :text="t('JL')" :size="30" /><wd-avatar
          :text="t('SW')"
          :size="30" /><wd-avatar :text="t('MK')" :size="30" /></wd-avatar-group
      ><text class="gallery-description">{{ t('Join 24 other makers') }}</text></view
    >
    <wd-button block @click="toast.show('Workshop selection saved in this preview.')">{{
      t('Save my spot')
    }}</wd-button>
  </GallerySection>
  <GallerySection
    :title="t('How did we do?')"
    :description="t('Your feedback makes the next version better.')"
  >
    <wd-rate v-model="ratingRef" :size="28" />
    <wd-textarea
      v-model="reviewRef"
      :placeholder="t('What worked well? What could feel better?')"
      :maxlength="240"
      show-word-limit
    />
    <wd-button block @click="toast.success(`Thanks for your ${ratingRef}-star demo review.`)">{{
      t('Send feedback')
    }}</wd-button>
    <text class="gallery-description">{{ t('Your review stays in this preview.') }}</text>
  </GallerySection>
  <GallerySection :title="t('Welcome back')" :description="t('Good to have you here again.')">
    <wd-form-item :title="t('Email address')"
      ><wd-input v-model="accessEmailRef" :placeholder="t('you@example.com')" clearable
    /></wd-form-item>
    <wd-button block @click="toast.show('Demo only. No sign-in email is sent.')">{{
      t('Continue with email')
    }}</wd-button>
    <wd-divider>{{ t('or explore first') }}</wd-divider>
    <wd-button block variant="plain" @click="toast.show('You are exploring as a demo guest.')">{{
      t('Continue as a guest')
    }}</wd-button>
    <text class="gallery-description">{{
      t('A simple sign-in layout, ready for your authentication flow.')
    }}</text>
  </GallerySection>
  <GallerySection
    :title="t('Take it with you')"
    :description="t('From your desktop to your next device.')"
  >
    <view class="layout-center"
      ><wd-qr-code text="https://shadcn-uniapp.guygubaby.top/create" :size="152"
    /></view>
    <view class="gallery-inline"
      ><wd-tag variant="light">H5</wd-tag><wd-tag variant="plain">{{ t('WeChat miniapp') }}</wd-tag
      ><wd-tag variant="plain">{{ t('Your theme') }}</wd-tag></view
    >
    <text class="gallery-description">{{
      t('Scan to open the theme creator on your phone.')
    }}</text>
    <wd-button
      block
      variant="plain"
      @click="toast.success('Everything is ready to make your own.')"
      >{{ t('Ready to create') }}</wd-button
    >
  </GallerySection>
</template>

<script setup lang="ts">
import { usePreviewI18n } from '../../i18n'

import { inject, ref, shallowRef } from 'vue'
import type { SignatureResult } from '@wot-ui/ui/components/wd-signature/types'
import { previewColorsKey } from '../../theme'
import GallerySection from './GallerySection.vue'
import SettingsForm from '../../blocks/settings-form/SettingsForm.vue'

const { t } = usePreviewI18n()
const colorsRef = inject(previewColorsKey)!
const inputRef = ref('Design systems')
const areaRef = ref('Made for H5 and WeChat.')
const numberRef = ref(3)
const checksRef = shallowRef(['design'])
const radioRef = ref('weekly')
const switchRef = ref(true)
const rateRef = ref(4)
const sliderRef = ref(42)
const passwordRef = ref('123')
const keyboardRef = ref(false)
const noticeRef = ref('')
const signatureRef = shallowRef<SignatureResult>()
</script>
<template>
  <view class="gallery-grid">
    <GallerySection
      :title="t('Inputs')"
      :description="t('Input, Textarea, InputNumber, and Search.')"
      ><wd-search
        v-model="inputRef"
        :placeholder="t('Search components')"
        hide-cancel /><wd-form-item :title="t('Project name')"
        ><wd-input v-model="inputRef" :placeholder="t('Your project')" clearable /></wd-form-item
      ><wd-textarea
        v-model="areaRef"
        :placeholder="t('A little about your project')"
        :maxlength="120"
        show-word-limit /><wd-input-number v-model="numberRef" :min="1" :max="10"
    /></GallerySection>
    <GallerySection
      :title="t('Choices')"
      :description="t('CheckboxGroup, RadioGroup, Switch, Rate, and Slider.')"
      ><wd-checkbox-group v-model="checksRef" shape="square" direction="horizontal" custom-class="sui-choice-group"
        ><wd-checkbox name="design">{{ t('Design') }}</wd-checkbox
        ><wd-checkbox name="code">{{ t('Development') }}</wd-checkbox></wd-checkbox-group
      ><wd-radio-group v-model="radioRef" direction="horizontal" custom-class="sui-choice-group"
        ><wd-radio value="daily">{{ t('Daily') }}</wd-radio
        ><wd-radio value="weekly">{{ t('Weekly') }}</wd-radio></wd-radio-group
      ><view class="gallery-inline"
        ><wd-switch v-model="switchRef" /><wd-rate v-model="rateRef" /></view
      ><wd-slider v-model="sliderRef"
    /></GallerySection>
    <GallerySection
      :title="t('Validated form')"
      :description="t('Form and FormItem. The save event stays local.')"
      ><SettingsForm
        email="hello@example.com"
        @save="noticeRef = `Validated: ${$event.email}`"
      /><text v-if="noticeRef" role="status" class="gallery-description">{{
        t(noticeRef)
      }}</text></GallerySection
    >
    <GallerySection
      :title="t('Password & keyboard')"
      :description="t('No credentials are stored or submitted.')"
      ><wd-password-input
        :model-value="passwordRef"
        :focused="keyboardRef"
        @focus="keyboardRef = true" /><wd-button variant="plain" @click="keyboardRef = true">{{
        t('Open keyboard')
      }}</wd-button
      ><wd-keyboard
        v-model="passwordRef"
        v-model:visible="keyboardRef"
        :maxlength="6"
        :title="t('Demo PIN')"
        :close-text="t('Done')"
        root-portal
    /></GallerySection>
    <GallerySection
      :title="t('Signature & verification')"
      :description="t('Local canvas and gesture interactions.')"
      ><wd-signature
        :height="140"
        :pen-color="colorsRef.foreground"
        :confirm-text="t('Confirm')"
        :clear-text="t('Clear')"
        :revoke-text="t('Undo')"
        :restore-text="t('Redo')"
        @confirm="signatureRef = $event"
        @clear="signatureRef = undefined" />
      <image
        v-if="signatureRef?.success"
        :src="signatureRef.tempFilePath"
        :aria-label="t('Signature preview')"
        mode="widthFix"
        style="width: 100%" />
      <text v-else-if="signatureRef" role="status" class="gallery-description">{{
        t('Could not export signature. Please try again.')
      }}</text>
      <wd-slide-verify :text="t('Slide to verify')" :success-text="t('Verified')"
    /></GallerySection>
    <GallerySection
      :title="t('Upload')"
      :description="t('Disabled fixture. No file is picked, uploaded, or sent to a server.')"
      ><wd-upload :auto-upload="false" disabled /><text class="gallery-description">{{
        t(
          'This checks the Wot upload appearance only. Production uploads are outside this test fixture.',
        )
      }}</text></GallerySection
    >
  </view>
</template>

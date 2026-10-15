<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import GallerySection from './GallerySection.vue'
import SettingsForm from '../../blocks/settings-form/SettingsForm.vue'
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
</script>
<template>
  <view class="gallery-grid">
    <GallerySection title="Inputs" description="Input, Textarea, InputNumber, and Search."
      ><wd-search v-model="inputRef" placeholder="Search components" hide-cancel /><wd-form-item
        title="Project name"
        ><wd-input v-model="inputRef" placeholder="Your project" clearable /></wd-form-item
      ><wd-textarea
        v-model="areaRef"
        placeholder="A little about your project"
        :maxlength="120"
        show-word-limit /><wd-input-number v-model="numberRef" :min="1" :max="10"
    /></GallerySection>
    <GallerySection
      title="Choices"
      description="CheckboxGroup, RadioGroup, Switch, Rate, and Slider."
      ><wd-checkbox-group v-model="checksRef" shape="square"
        ><wd-checkbox name="design">Design</wd-checkbox
        ><wd-checkbox name="code">Development</wd-checkbox></wd-checkbox-group
      ><wd-radio-group v-model="radioRef" inline
        ><wd-radio value="daily">Daily</wd-radio
        ><wd-radio value="weekly">Weekly</wd-radio></wd-radio-group
      ><view class="gallery-inline"
        ><wd-switch v-model="switchRef" /><wd-rate v-model="rateRef" /></view
      ><wd-slider v-model="sliderRef"
    /></GallerySection>
    <GallerySection
      title="Validated form"
      description="Form and FormItem. The save event stays local."
      ><SettingsForm
        email="hello@example.com"
        @save="noticeRef = `Validated: ${$event.email}`"
      /><text v-if="noticeRef" role="status" class="gallery-description">{{
        noticeRef
      }}</text></GallerySection
    >
    <GallerySection
      title="Password & keyboard"
      description="No credentials are stored or submitted."
      ><wd-password-input
        :model-value="passwordRef"
        :focused="keyboardRef"
        @focus="keyboardRef = true" /><wd-button variant="plain" @click="keyboardRef = true"
        >Open keyboard</wd-button
      ><wd-keyboard
        v-model="passwordRef"
        v-model:visible="keyboardRef"
        :maxlength="6"
        title="Demo PIN"
        close-text="Done"
        root-portal
    /></GallerySection>
    <GallerySection
      title="Signature & verification"
      description="Local canvas and gesture interactions."
      ><wd-signature
        :height="140"
        confirm-text="Confirm"
        clear-text="Clear"
        revoke-text="Undo"
        restore-text="Redo" /><wd-slide-verify text="Slide to verify" success-text="Verified"
    /></GallerySection>
    <GallerySection
      title="Upload"
      description="Disabled fixture. No file is picked, uploaded, or sent to a server."
      ><wd-upload :auto-upload="false" disabled /><text class="gallery-description"
        >This checks the Wot upload appearance only. Production uploads are outside this test
        fixture.</text
      ></GallerySection
    >
  </view>
</template>

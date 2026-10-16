<script setup lang="ts">
import { usePreviewI18n } from '../../../i18n'

import { computed, ref, shallowRef } from 'vue'
import { useToast } from '@wot-ui/ui'
import GallerySection from '../GallerySection.vue'

const { t } = usePreviewI18n()
const toast = useToast('layouts')
const emailRef = ref('alex@acme.com')
const planRef = ref('pro')
const notificationsRef = ref(true)
const mentionsRef = ref(true)
const newsletterRef = ref(false)
const messageRef = ref('')
const messagesRef = shallowRef(['The new theme looks great. Ready for a quick review?'])
const tasksRef = shallowRef(['tokens', 'components'])
const progress = computed(() => Math.round((tasksRef.value.length / 4) * 100))
const faqRef = shallowRef(['source'])
const members = [
  { initials: 'AM', name: 'Alex Morgan', role: 'Design lead' },
  { initials: 'SW', name: 'Sam Wilson', role: 'Developer' },
  { initials: 'JL', name: 'Jordan Lee', role: 'Product designer' },
]
function sendMessage() {
  const message = messageRef.value.trim()
  if (!message) return
  messagesRef.value = [...messagesRef.value, message]
  messageRef.value = ''
}
</script>
<template>
  <GallerySection
    :title="t('Contribution history')"
    :description="t('A little progress, every day.')"
  >
    <view class="overview-chart">
      <view v-for="(height, i) in [44, 76, 59, 91, 53, 100]" :key="i" class="overview-chart-column">
        <view class="overview-chart-bar" :style="{ height: `${height}%` }" />
        <text>{{ t(['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]) }}</text>
      </view>
    </view>
    <wd-divider />
    <view class="layout-between"
      ><view
        ><text class="gallery-description">{{ t('Total contributions') }}</text
        ><text class="overview-metric">1,284</text></view
      ><wd-tag type="success" variant="light">+24.5%</wd-tag></view
    >
    <wd-button block variant="plain" @click="toast.show('Your activity report is up to date.')">{{
      t('View full report')
    }}</wd-button>
  </GallerySection>
  <GallerySection :title="t('Your team')" :description="t('Good work starts with great people.')">
    <view v-for="member in members" :key="member.name" class="overview-person">
      <wd-avatar :text="t(member.initials)" :size="38" />
      <view class="layout-grow"
        ><text class="overview-person-name">{{ t(member.name) }}</text
        ><text class="gallery-description">{{ t(member.role) }}</text></view
      >
      <wd-tag type="success" variant="light">{{ t('Active') }}</wd-tag>
    </view>
    <wd-button block @click="toast.show('Your demo invitation link is ready.')">{{
      t('Invite member')
    }}</wd-button>
  </GallerySection>
  <GallerySection
    :title="t('Create a workspace')"
    :description="t('A new home for your next big idea.')"
  >
    <wd-form-item :title="t('Work email')"
      ><wd-input v-model="emailRef" :placeholder="t('you@example.com')" clearable
    /></wd-form-item>
    <wd-form-item :title="t('Your plan')"
      ><wd-radio-group v-model="planRef" direction="horizontal" custom-class="sui-choice-group"
        ><wd-radio value="starter">{{ t('Starter') }}</wd-radio
        ><wd-radio value="pro">{{ t('Pro') }}</wd-radio></wd-radio-group
      ></wd-form-item
    >
    <wd-cell :title="t('Email notifications')"><wd-switch v-model="notificationsRef" /></wd-cell>
    <wd-button block @click="toast.show('Workspace preview saved locally.')">{{
      t('Create workspace')
    }}</wd-button>
    <text class="gallery-description">{{ t('Try the form. No account is created.') }}</text>
  </GallerySection>
  <GallerySection
    :title="t('Notifications')"
    :description="t('Keep the updates that matter to you.')"
  >
    <wd-cell :title="t('Mentions & replies')" :label="t('When someone needs your attention')"
      ><wd-switch v-model="mentionsRef"
    /></wd-cell>
    <wd-cell :title="t('Product newsletter')" :label="t('A monthly dose of inspiration')"
      ><wd-switch v-model="newsletterRef"
    /></wd-cell>
    <wd-notice-bar :text="t('You are all caught up.')" :scrollable="false" prefix="check-circle" />
    <wd-button
      block
      variant="plain"
      @click="toast.success('Notification preferences saved locally.')"
      >{{ t('Save preferences') }}</wd-button
    >
  </GallerySection>
  <GallerySection
    :title="t('Team conversation')"
    :description="t('A small space for the next big idea.')"
  >
    <view class="overview-person"
      ><wd-badge is-dot><wd-avatar :text="t('JL')" :size="36" /></wd-badge
      ><view
        ><text class="overview-person-name">{{ t('Jordan Lee') }}</text
        ><text class="gallery-description">{{ t('Online now') }}</text></view
      ></view
    >
    <view v-for="(message, index) in messagesRef" :key="index" class="gallery-surface">{{
      t(message)
    }}</view>
    <wd-input
      v-model="messageRef"
      :placeholder="t('Write a message')"
      clearable
      @confirm="sendMessage"
    />
    <wd-button block :disabled="!messageRef.trim()" @click="sendMessage">{{
      t('Send message')
    }}</wd-button>
  </GallerySection>
  <GallerySection
    :title="t('Launch checklist')"
    :description="t('Make your next release a good one.')"
  >
    <view class="layout-between"
      ><text class="gallery-description">{{ t('Release readiness') }}</text
      ><wd-tag variant="light">{{ t(progress) }}%</wd-tag></view
    >
    <wd-progress :percentage="progress" />
    <wd-checkbox-group v-model="tasksRef" shape="square">
      <wd-checkbox name="tokens">{{ t('Define design tokens') }}</wd-checkbox>
      <wd-checkbox name="components">{{ t('Build core components') }}</wd-checkbox>
      <wd-checkbox name="review">{{ t('Review accessibility') }}</wd-checkbox>
      <wd-checkbox name="release">{{ t('Publish the release') }}</wd-checkbox>
    </wd-checkbox-group>
  </GallerySection>
  <GallerySection
    :title="t('Project overview')"
    :description="t('Website refresh · Autumn release')"
  >
    <view class="layout-between"
      ><wd-tag type="primary" variant="light">{{ t('In progress') }}</wd-tag
      ><wd-avatar-group
        ><wd-avatar :text="t('AM')" :size="28" /><wd-avatar :text="t('SW')" :size="28" /><wd-avatar
          :text="t('JL')"
          :size="28" /></wd-avatar-group
    ></view>
    <text class="overview-metric"
      >12 / 18 <text class="gallery-description">{{ t('tasks completed') }}</text></text
    >
    <wd-progress :percentage="67" />
    <wd-steps :active="1"
      ><wd-step :title="t('Design')" /><wd-step :title="t('Develop')" /><wd-step
        :title="t('Launch')"
    /></wd-steps>
    <wd-button block variant="plain" @click="toast.show('Next milestone: component review.')">{{
      t('View project')
    }}</wd-button>
  </GallerySection>
  <GallerySection
    :title="t('A few good answers')"
    :description="t('Everything you need to get started.')"
  >
    <wd-collapse v-model="faqRef">
      <wd-collapse-item name="source" :title="t('Can I make these blocks my own?')">{{
        t('Yes. Source-owned blocks are editable Vue components.')
      }}</wd-collapse-item>
      <wd-collapse-item name="theme" :title="t('Does every component follow my theme?')">{{
        t('Colors, typography, density, and radii come from the same theme.')
      }}</wd-collapse-item>
      <wd-collapse-item name="platforms" :title="t('Where can I use Wot UI?')">{{
        t('Build for uni-app H5 and supported miniapp platforms.')
      }}</wd-collapse-item>
    </wd-collapse>
    <wd-button
      block
      variant="plain"
      @click="toast.show('Explore the Docs page for setup instructions.')"
      >{{ t('Get help') }}</wd-button
    >
  </GallerySection>
</template>

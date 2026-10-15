<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import GallerySection from './GallerySection.vue'
const notificationsRef = ref(true)
const emailRef = ref('alex@acme.com')
const planRef = ref('pro')
const noticeRef = ref('')
const tabRef = ref(0)
const members = [
  { name: 'Alex Morgan', role: 'alex@acme.com', initials: 'AM' },
  { name: 'Sam Wilson', role: 'sam@acme.com', initials: 'SW' },
  { name: 'Jordan Lee', role: 'jordan@acme.com', initials: 'JL' },
]
const options = shallowRef(['Theme', 'Preview', 'Export'])
const stepRef = ref('Theme')
</script>
<template>
  <view class="overview-board">
    <view class="overview-column">
      <GallerySection
        title="Contribution history"
        description="Your activity over the last six months."
        ><view class="overview-chart"
          ><view
            v-for="(height, i) in [44, 76, 59, 91, 53, 100]"
            :key="i"
            class="overview-chart-column"
            ><view class="overview-chart-bar" :style="{ height: `${height}%` }" /><text>{{
              ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]
            }}</text></view
          ></view
        ><wd-divider /><view class="gallery-inline" style="justify-content: space-between"
          ><view
            ><text class="gallery-description">Total contributions</text
            ><text class="overview-metric">1,284</text></view
          ><wd-tag type="success" variant="light">+24.5%</wd-tag></view
        ><wd-button block variant="plain" @click="noticeRef = 'This chart uses local example data.'"
          >View activity</wd-button
        ></GallerySection
      >
      <GallerySection title="Your team" description="Invite your team to collaborate."
        ><view v-for="member in members" :key="member.name" class="overview-person"
          ><wd-avatar :text="member.initials" :size="34" /><view style="flex: 1"
            ><text class="overview-person-name">{{ member.name }}</text
            ><text class="gallery-description">{{ member.role }}</text></view
          ><wd-icon name="more" /></view
        ><wd-button block @click="noticeRef = 'Invite action is ready for your business logic.'"
          >Invite member</wd-button
        ></GallerySection
      >
      <GallerySection title="Appearance" description="Small details. A consistent language."
        ><wd-segmented v-model:value="stepRef" :options="options" /><view class="gallery-inline"
          ><wd-tag type="primary">Primary</wd-tag
          ><wd-tag type="success" variant="plain">Ready</wd-tag
          ><wd-tag type="warning" variant="light">In review</wd-tag></view
        ><wd-progress :percentage="68"
      /></GallerySection>
    </view>
    <view class="overview-column">
      <GallerySection title="Create a workspace" description="A new home for your next big idea."
        ><wd-form-item title="Email"
          ><wd-input v-model="emailRef" placeholder="you@example.com" clearable /></wd-form-item
        ><wd-form-item title="Plan"
          ><wd-radio-group v-model="planRef"
            ><wd-radio value="starter">Starter</wd-radio
            ><wd-radio value="pro">Pro</wd-radio></wd-radio-group
          ></wd-form-item
        ><wd-cell title="Email notifications"><wd-switch v-model="notificationsRef" /></wd-cell
        ><wd-button block @click="noticeRef = `Workspace demo: ${emailRef}`"
          >Create workspace</wd-button
        ><text class="gallery-description"
          >Local preview only. No account is created.</text
        ></GallerySection
      >
      <GallerySection
        title="Payment method"
        description="All transactions are secure and encrypted."
        ><wd-tabs v-model="tabRef"
          ><wd-tab title="Card"
            ><view class="gallery-surface"
              ><wd-icon name="creditcard" size="24" /><text
                class="overview-person-name"
                style="margin-top: 12px"
                >Visa ending in 4242</text
              ><text class="gallery-description">Expires 12 / 2028</text></view
            ></wd-tab
          ><wd-tab title="Transfer"
            ><view class="gallery-surface">Connect your payment provider here.</view></wd-tab
          ></wd-tabs
        ><wd-button
          block
          variant="plain"
          @click="noticeRef = 'No payment information is stored in this preview.'"
          >Manage payment</wd-button
        ></GallerySection
      >
    </view>
    <view class="overview-column">
      <GallerySection title="Savings targets" description="A little closer, every month."
        ><text class="gallery-description">Your next milestone</text
        ><text class="overview-metric">$24,500</text><wd-progress :percentage="65" /><view
          class="gallery-inline"
          style="justify-content: space-between"
          ><text class="gallery-description">65% achieved</text
          ><text class="gallery-description">$37,500 goal</text></view
        ><wd-divider /><text class="gallery-description">Yearly target</text
        ><text class="overview-metric">$85,000</text><wd-progress :percentage="32"
      /></GallerySection>
      <GallerySection title="Recent activity" description="Your latest workspace updates."
        ><wd-cell title="Design system" label="Updated 2 minutes ago" icon="palette" /><wd-cell
          title="Mobile components"
          label="3 new components"
          icon="mobile" /><wd-cell
          title="Theme exported"
          label="Ready for your project"
          icon="download" /><wd-cell
          title="All changes saved"
          label="You are up to date"
          icon="check-circle"
      /></GallerySection>
      <GallerySection title="Make it yours" description="The same components. Your design language."
        ><view class="gallery-inline"
          ><wd-button @click="noticeRef = 'Ready to connect to your app.'">Get started</wd-button
          ><wd-button
            variant="plain"
            @click="noticeRef = 'Explore all components from the preview toolbar.'"
            >Learn more</wd-button
          ></view
        ></GallerySection
      >
    </view>
    <view v-if="noticeRef" role="status" class="overview-notice" @click="noticeRef = ''"
      >{{ noticeRef }} <text>Dismiss</text></view
    >
  </view>
</template>

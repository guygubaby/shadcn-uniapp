<script setup lang="ts">
import GalleryGrid from './GalleryGrid.vue'
import { usePreviewI18n } from '../../i18n'

import { inject, ref, shallowRef } from 'vue'
import { previewColorsKey } from '../../theme'
import GallerySection from './GallerySection.vue'
import { House, Search, UserRound } from '@lucide/vue'

const { t } = usePreviewI18n()
const colorsRef = inject(previewColorsKey)!
const tabRef = ref(0)
const segmentRef = ref('Overview')
const navRef = ref('home')
const sidebarRef = ref(0)
const pageRef = ref(1)
const dropRef = ref('all')
const sortRef = ref(0)
const fabRef = ref(false)
const panelRef = ref(false)
const heightRef = ref(160)
const anchors = shallowRef([160, 300])
</script>
<template>
  <GalleryGrid>
    <GallerySection
      :title="t('Navigation bars')"
      :description="t('Navbar, NavbarCapsule, Tabbar, and TabbarItem.')"
      ><wd-navbar :title="t('Workspace')" :left-text="t('Back')" left-arrow
        ><template #capsule><wd-navbar-capsule /></template></wd-navbar
      ><wd-tabbar v-model="navRef" :fixed="false" :safe-area-inset-bottom="false"
        ><wd-tabbar-item name="home" :title="t('Home')"
          ><template #icon="{ active }"
            ><House :color="active ? colorsRef.primary : colorsRef.mutedForeground" /></template
        ></wd-tabbar-item>
        <wd-tabbar-item name="search" :title="t('Search')"
          ><template #icon="{ active }"
            ><Search :color="active ? colorsRef.primary : colorsRef.mutedForeground" /></template
        ></wd-tabbar-item>
        <wd-tabbar-item name="profile" :title="t('Profile')"
          ><template #icon="{ active }"
            ><UserRound
              :color="
                active ? colorsRef.primary : colorsRef.mutedForeground
              " /></template></wd-tabbar-item></wd-tabbar
    ></GallerySection>
    <GallerySection
      :title="t('Tabs & segmented')"
      :description="t('Switch content and keep the indicator in its control.')"
      ><wd-tabs v-model="tabRef"
        ><wd-tab :title="t('Overview')"
          ><view class="gallery-surface">{{ t('Your project at a glance.') }}</view></wd-tab
        ><wd-tab :title="t('Activity')"
          ><view class="gallery-surface"
            >{{ t('A taller panel.') }}<view style="height: 60px" />{{
              t('Your latest activity.')
            }}</view
          ></wd-tab
        ><wd-tab :title="t('Settings')"
          ><view class="gallery-surface">{{ t('Project settings.') }}</view></wd-tab
        ></wd-tabs
      ><wd-segmented
        v-model:value="segmentRef"
        :options="[
          { label: t('Overview'), value: 'Overview' },
          { label: t('Activity'), value: 'Activity' },
          { label: t('Settings'), value: 'Settings' },
        ]"
        ><template #label="{ option }">{{ t(option.value) }}</template></wd-segmented
      ></GallerySection
    >
    <GallerySection
      :title="t('Sidebar & steps')"
      :description="t('Sidebar, SidebarItem, Steps, and Step.')"
      ><view style="display: flex"
        ><wd-sidebar v-model="sidebarRef"
          ><wd-sidebar-item :value="0" :label="t('Design')" /><wd-sidebar-item
            :value="1"
            :label="t('Build')" /><wd-sidebar-item :value="2" :label="t('Ship')" /></wd-sidebar
        ><view class="gallery-surface" style="flex: 1">{{
          t(
            ['Make it yours.', 'Connect your business logic.', 'Build for H5 and WeChat.'][
              sidebarRef
            ],
          )
        }}</view></view
      ><wd-steps :active="1"
        ><wd-step :title="t('Theme')" /><wd-step :title="t('Preview')" /><wd-step
          :title="t('Export')" /></wd-steps
    ></GallerySection>
    <GallerySection
      :title="t('Pagination & menus')"
      :description="t('Pagination, DropMenu, DropMenuItem, and SortButton.')"
      ><wd-drop-menu
        ><wd-drop-menu-item
          v-model="dropRef"
          :options="[
            { label: t('All items'), value: 'all' },
            { label: t('Active'), value: 'active' },
          ]" /></wd-drop-menu
      ><wd-sort-button v-model="sortRef" :title="t('Sort by name')" /><wd-pagination
        v-model="pageRef"
        :total="80"
        :page-size="10"
    /></GallerySection>
    <GallerySection
      :title="t('Index & sticky')"
      :description="t('IndexBar, IndexAnchor, StickyBox, Sticky, and Backtop.')"
      ><view style="height: 220px; overflow: hidden"
        ><wd-index-bar :sticky="false"
          ><view v-for="letter in ['A', 'B', 'C']" :key="letter"
            ><wd-index-anchor :index="letter" /><wd-cell
              :title="t(`${letter} component`)" /></view></wd-index-bar></view
      ><wd-sticky-box
        ><wd-sticky :offset-top="0"
          ><view class="gallery-surface">{{ t('Sticky heading') }}</view></wd-sticky
        ><view class="gallery-description">{{
          t('Scroll the preview to test the sticky container.')
        }}</view></wd-sticky-box
      ><wd-backtop :scroll-top="0"
    /></GallerySection>
    <GallerySection
      :title="t('Floating controls')"
      :description="t('Fab and FloatingPanel. Open them explicitly.')"
      ><view class="gallery-inline"
        ><wd-button variant="plain" @click="fabRef = !fabRef">{{
          t('Toggle floating action')
        }}</wd-button
        ><wd-button variant="plain" @click="panelRef = true">{{
          t('Open floating panel')
        }}</wd-button></view
      ><wd-fab v-if="fabRef" :expandable="false" @click="fabRef = false" /><wd-floating-panel
        v-if="panelRef"
        v-model:height="heightRef"
        :anchors="anchors"
        ><view style="padding: 24px"
          ><text class="gallery-title">{{ t('Floating panel') }}</text
          ><wd-button @click="panelRef = false">{{ t('Close panel') }}</wd-button></view
        ></wd-floating-panel
      ></GallerySection
    >
  </GalleryGrid>
</template>

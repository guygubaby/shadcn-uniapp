<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import GallerySection from './GallerySection.vue'
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
  <view class="gallery-grid">
    <GallerySection
      title="Navigation bars"
      description="Navbar, NavbarCapsule, Tabbar, and TabbarItem."
      ><wd-navbar title="Workspace" left-text="Back" left-arrow
        ><template #capsule><wd-navbar-capsule /></template></wd-navbar
      ><wd-tabbar v-model="navRef" :fixed="false" :safe-area-inset-bottom="false"
        ><wd-tabbar-item name="home" title="Home" icon="home" /><wd-tabbar-item
          name="search"
          title="Search"
          icon="search" /><wd-tabbar-item name="profile" title="Profile" icon="user" /></wd-tabbar
    ></GallerySection>
    <GallerySection
      title="Tabs & segmented"
      description="Switch content and keep the indicator in its control."
      ><wd-tabs v-model="tabRef"
        ><wd-tab title="Overview"
          ><view class="gallery-surface">Your project at a glance.</view></wd-tab
        ><wd-tab title="Activity"
          ><view class="gallery-surface"
            >A taller panel.<view style="height: 60px" />Your latest activity.</view
          ></wd-tab
        ><wd-tab title="Settings"
          ><view class="gallery-surface">Project settings.</view></wd-tab
        ></wd-tabs
      ><wd-segmented v-model:value="segmentRef" :options="['Overview', 'Activity', 'Settings']"
    /></GallerySection>
    <GallerySection title="Sidebar & steps" description="Sidebar, SidebarItem, Steps, and Step."
      ><view style="display: flex"
        ><wd-sidebar v-model="sidebarRef"
          ><wd-sidebar-item :value="0" label="Design" /><wd-sidebar-item
            :value="1"
            label="Build" /><wd-sidebar-item :value="2" label="Ship" /></wd-sidebar
        ><view class="gallery-surface" style="flex: 1">{{
          ['Make it yours.', 'Connect your business logic.', 'Build for H5 and WeChat.'][sidebarRef]
        }}</view></view
      ><wd-steps :active="1"
        ><wd-step title="Theme" /><wd-step title="Preview" /><wd-step title="Export" /></wd-steps
    ></GallerySection>
    <GallerySection
      title="Pagination & menus"
      description="Pagination, DropMenu, DropMenuItem, and SortButton."
      ><wd-drop-menu
        ><wd-drop-menu-item
          v-model="dropRef"
          :options="[
            { label: 'All items', value: 'all' },
            { label: 'Active', value: 'active' },
          ]" /></wd-drop-menu
      ><wd-sort-button v-model="sortRef" title="Sort by name" /><wd-pagination
        v-model="pageRef"
        :total="80"
        :page-size="10"
    /></GallerySection>
    <GallerySection
      title="Index & sticky"
      description="IndexBar, IndexAnchor, StickyBox, Sticky, and Backtop."
      ><view style="height: 220px; overflow: hidden"
        ><wd-index-bar :sticky="false"
          ><view v-for="letter in ['A', 'B', 'C']" :key="letter"
            ><wd-index-anchor :index="letter" /><wd-cell
              :title="`${letter} component`" /></view></wd-index-bar></view
      ><wd-sticky-box
        ><wd-sticky :offset-top="0"><view class="gallery-surface">Sticky heading</view></wd-sticky
        ><view class="gallery-description"
          >Scroll the preview to test the sticky container.</view
        ></wd-sticky-box
      ><wd-backtop :scroll-top="0"
    /></GallerySection>
    <GallerySection
      title="Floating controls"
      description="Fab and FloatingPanel. Open them explicitly."
      ><view class="gallery-inline"
        ><wd-button variant="plain" @click="fabRef = !fabRef">Toggle floating action</wd-button
        ><wd-button variant="plain" @click="panelRef = true">Open floating panel</wd-button></view
      ><wd-fab v-if="fabRef" :expandable="false" @click="fabRef = false" /><wd-floating-panel
        v-if="panelRef"
        v-model:height="heightRef"
        :anchors="anchors"
        ><view style="padding: 24px"
          ><text class="gallery-title">Floating panel</text
          ><wd-button @click="panelRef = false">Close panel</wd-button></view
        ></wd-floating-panel
      ></GallerySection
    >
  </view>
</template>

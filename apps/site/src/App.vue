<script setup lang="ts">
import { useI18n } from '@/lib/i18n'
const { t, localeRef } = useI18n()

import { GitBranch, Moon, Sun } from '@lucide/vue'
import { motion, useReducedMotion } from 'motion-v'
import { Toaster } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import BrandMark from '@/components/BrandMark.vue'
import RouteStage from '@/components/motion/RouteStage.vue'
import SiteCursor from '@/components/motion/SiteCursor.vue'
import RevealBlock from '@/components/motion/RevealBlock.vue'
import SiteMenu from '@/components/motion/SiteMenu.vue'
import { computed, provide, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useAppearanceStore } from '@/stores/appearance'

const route = useRoute()
const reducedRef = useReducedMotion()
const { modeRef } = storeToRefs(useAppearanceStore())
provide('shadcn-uniapp:translate', t)
watch(
  localeRef,
  (locale) => {
    document.documentElement.lang = locale
    try {
      localStorage.setItem('shadcn-uniapp:locale', locale)
    } catch {
      /* Keep the in-memory preference. */
    }
  },
  { immediate: true },
)
watch(
  () => route.query.mode,
  (mode) => {
    if (mode === 'light' || mode === 'dark') modeRef.value = mode
  },
  { immediate: true },
)
watch(
  modeRef,
  (mode) => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
    document.documentElement.style.colorScheme = mode
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', mode === 'dark' ? '#111113' : '#ffffff')
  },
  { immediate: true },
)
const isCreator = computed(() => ['/create', '/creator'].includes(route.path))

const pageTitles: Record<string, string> = {
  '/': 'New theme. Same components.',
  '/create': 'Create your theme',
  '/creator': 'Theme Creator',
  '/blocks': 'Source-owned blocks',
  '/docs': 'Getting started',
}
watch(
  () => [route.path, localeRef.value],
  () => {
    document.title = `${t(pageTitles[route.path] ?? 'Page not found')} — shadcn-uniapp`
  },
  { immediate: true },
)

const links = [
  { to: '/create', label: 'Create' },
  { to: '/blocks', label: 'Blocks' },
  { to: '/docs', label: 'Docs' },
]
</script>

<template>
  <a
    href="#main-content"
    class="sr-only z-50 rounded-md bg-background p-3 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >{{ t('Skip to main content') }}</a
  >
  <div
    v-if="!isCreator"
    aria-hidden="true"
    class="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-foreground"
  />
  <motion.header
    :initial="reducedRef ? false : { opacity: 0, y: -16 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: reducedRef ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }"
    class="sticky top-0 z-40 bg-background/95 backdrop-blur-sm"
    :class="!isCreator && 'border-b'"
  >
    <div
      class="mx-auto flex h-14 items-center justify-between gap-4 px-5 lg:px-8"
      :class="!isCreator && 'max-w-7xl'"
    >
      <RouterLink
        to="/"
        class="group/brand flex min-w-0 items-center gap-2.5 text-base font-bold tracking-tight"
      >
        <BrandMark
          class="size-7 shrink-0 scale-100 rotate-0 transition-transform duration-500 group-hover/brand:scale-110 group-hover/brand:-rotate-6 motion-reduce:transform-none motion-reduce:transition-none"
        />
        <span>shadcn-uniapp</span>
      </RouterLink>
      <nav :aria-label="t('Main navigation')" class="hidden items-center gap-7 sm:flex">
        <motion.span
          v-for="(link, index) in links"
          :key="link.to"
          :initial="reducedRef ? false : { opacity: 0, y: -10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: reducedRef ? 0 : 0.6, delay: reducedRef ? 0 : index * 0.08 }"
          ><RouterLink
            :to="link.to"
            class="nav-link text-sm font-medium text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground"
            >{{ t(link.label) }}</RouterLink
          ></motion.span
        >
      </nav>
      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          :aria-label="t('Switch language')"
          @click="localeRef = localeRef === 'zh-CN' ? 'en-US' : 'zh-CN'"
          ><motion.span
            :key="localeRef"
            :initial="reducedRef ? false : { opacity: 0, y: 6 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: reducedRef ? 0 : 0.2 }"
            >{{ t(localeRef === 'zh-CN' ? 'EN' : '中文') }}</motion.span
          ></Button
        >
        <Button
          variant="ghost"
          size="icon"
          :aria-label="t(modeRef === 'light' ? 'Use dark theme' : 'Use light theme')"
          @click="modeRef = modeRef === 'light' ? 'dark' : 'light'"
          ><motion.span
            :key="modeRef"
            class="inline-flex"
            :initial="reducedRef ? false : { opacity: 0, rotate: -45, scale: 0.6 }"
            :animate="{ opacity: 1, rotate: 0, scale: 1 }"
            :transition="{ duration: reducedRef ? 0 : 0.25 }"
            ><Moon v-if="modeRef === 'light'" /><Sun v-else /></motion.span
        ></Button>
        <Button as-child variant="ghost" size="icon" class="hidden sm:inline-flex">
          <a
            href="https://github.com/guygubaby/shadcn-uniapp"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('Source on GitHub')"
            ><GitBranch
          /></a>
        </Button>
        <SiteMenu :links="links" />
      </div>
    </div>
  </motion.header>
  <main id="main-content" tabindex="-1"><RouteStage /></main>
  <RevealBlock v-if="!isCreator"
    ><footer class="border-t">
      <div
        class="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"
      >
        <p>{{ t('Built on Wot UI 2.x. Your theme. Your code.') }}</p>
        <div class="flex gap-5">
          <a
            href="https://github.com/guygubaby/shadcn-uniapp"
            class="nav-link hover:text-foreground"
            >GitHub</a
          >
          <a
            href="https://github.com/guygubaby/shadcn-uniapp/blob/main/LICENSE"
            class="nav-link hover:text-foreground"
            >MIT License</a
          >
        </div>
      </div>
    </footer></RevealBlock
  >
  <SiteCursor />
  <Toaster position="bottom-right" :theme="modeRef" rich-colors />
</template>

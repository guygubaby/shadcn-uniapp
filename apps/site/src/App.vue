<script setup lang="ts">
import { useI18n } from '@/lib/i18n'
const { t, localeRef } = useI18n()

import { GitBranch, Menu, Moon, Sun } from '@lucide/vue'
import { Toaster } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import BrandMark from '@/components/BrandMark.vue'
import RouteStage from '@/components/motion/RouteStage.vue'
import SiteCursor from '@/components/motion/SiteCursor.vue'
import { computed, provide, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useAppearanceStore } from '@/stores/appearance'

const route = useRoute()
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
  <header class="sticky top-0 z-40 bg-background" :class="!isCreator && 'border-b'">
    <div
      class="mx-auto flex h-14 items-center justify-between gap-4 px-5 lg:px-8"
      :class="!isCreator && 'max-w-7xl'"
    >
      <RouterLink
        to="/"
        class="flex min-w-0 items-center gap-2.5 text-base font-bold tracking-tight"
      >
        <BrandMark class="size-7 shrink-0" />
        <span>shadcn-uniapp</span>
      </RouterLink>
      <nav :aria-label="t('Main navigation')" class="hidden items-center gap-7 sm:flex">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link text-sm font-medium text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground"
          >{{ t(link.label) }}</RouterLink
        >
      </nav>
      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          :aria-label="t('Switch language')"
          @click="localeRef = localeRef === 'zh-CN' ? 'en-US' : 'zh-CN'"
          >{{ t(localeRef === 'zh-CN' ? 'EN' : '中文') }}</Button
        >
        <Button
          variant="ghost"
          size="icon"
          :aria-label="t(modeRef === 'light' ? 'Use dark theme' : 'Use light theme')"
          @click="modeRef = modeRef === 'light' ? 'dark' : 'light'"
          ><Moon v-if="modeRef === 'light'" /><Sun v-else
        /></Button>
        <Button as-child variant="ghost" size="icon" class="hidden sm:inline-flex">
          <a
            href="https://github.com/guygubaby/shadcn-uniapp"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('Source on GitHub')"
            ><GitBranch
          /></a>
        </Button>
        <details class="relative sm:hidden">
          <summary
            class="flex size-10 list-none items-center justify-center rounded-md border"
            :aria-label="t('Open navigation')"
          >
            <Menu class="size-5" />
          </summary>
          <nav
            :aria-label="t('Mobile navigation')"
            class="absolute top-12 right-0 flex w-40 flex-col gap-1 rounded-lg border bg-background p-2 shadow-sm"
          >
            <RouterLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="rounded-md px-3 py-2 text-sm hover:bg-muted"
              @click="
                ($event.currentTarget as HTMLElement).closest('details')?.removeAttribute('open')
              "
              >{{ t(link.label) }}</RouterLink
            >
          </nav>
        </details>
      </div>
    </div>
  </header>
  <main id="main-content" tabindex="-1"><RouteStage /></main>
  <footer v-if="!isCreator" class="border-t">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"
    >
      <p>{{ t('Built on Wot UI 2.x. Your theme. Your code.') }}</p>
      <div class="flex gap-5">
        <a href="https://github.com/guygubaby/shadcn-uniapp" class="hover:text-foreground"
          >GitHub</a
        >
        <a
          href="https://github.com/guygubaby/shadcn-uniapp/blob/main/LICENSE"
          class="hover:text-foreground"
          >MIT License</a
        >
      </div>
    </div>
  </footer>
  <SiteCursor />
  <Toaster position="bottom-right" :theme="modeRef" rich-colors />
</template>

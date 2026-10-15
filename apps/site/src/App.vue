<script setup lang="ts">
import { Grid2X2, GitBranch, Menu } from '@lucide/vue'
import { Toaster } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCreator = computed(() => ['/create', '/creator'].includes(route.path))

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
    >Skip to main content</a
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
        <Grid2X2 class="size-5 shrink-0" aria-hidden="true" />
        <span>shadcn-uniapp</span>
      </RouterLink>
      <nav aria-label="Main navigation" class="hidden items-center gap-7 sm:flex">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground"
          >{{ link.label }}</RouterLink
        >
      </nav>
      <div class="flex items-center gap-2">
        <Button as-child variant="ghost" size="icon" class="hidden sm:inline-flex">
          <a
            href="https://github.com/guygubaby/shadcn-uniapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Source on GitHub"
            ><GitBranch
          /></a>
        </Button>
        <details class="relative sm:hidden">
          <summary
            class="flex size-10 list-none items-center justify-center rounded-md border"
            aria-label="Open navigation"
          >
            <Menu class="size-5" />
          </summary>
          <nav
            aria-label="Mobile navigation"
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
              >{{ link.label }}</RouterLink
            >
          </nav>
        </details>
      </div>
    </div>
  </header>
  <main id="main-content" tabindex="-1"><RouterView /></main>
  <footer v-if="!isCreator" class="border-t">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"
    >
      <p>Built on Wot UI 2.x. Your theme. Your code.</p>
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
  <Toaster position="bottom-right" rich-colors />
</template>

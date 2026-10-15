<script setup lang="ts">
import { useI18n } from '@/lib/i18n'

import { Button } from '@/components/ui/button'

const { t } = useI18n()
</script>
<template>
  <section class="mx-auto max-w-3xl px-5 py-24">
    <p class="text-sm text-muted-foreground">404</p>
    <h1 class="mt-3 text-3xl font-semibold">{{ t('This page does not exist.') }}</h1>
    <p class="mt-4 text-muted-foreground">
      {{ t('Head back home, or pick up where you left off in the docs.') }}
    </p>
    <div class="mt-7 flex gap-3">
      <Button as-child
        ><RouterLink to="/">{{ t('Back to home') }}</RouterLink></Button
      ><Button as-child variant="outline"
        ><RouterLink to="/docs">{{ t('Read the docs') }}</RouterLink></Button
      >
    </div>
  </section>
</template>

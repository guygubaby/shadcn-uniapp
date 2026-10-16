import { expect, it } from 'vitest'
import { formatBlockSource } from '../apps/site/src/lib/block-source'
import { removePreviewI18n } from '../scripts/block-source.mjs'

it('removes blank opening lines without changing script indentation or internal spacing', () => {
  expect(
    formatBlockSource(
      '\n<script setup lang="ts">\r\n  \r\n\r\n  const value = 1\n\n  console.log(value)\n</script>',
    ),
  ).toBe('<script setup lang="ts">\n  const value = 1\n\n  console.log(value)\n</script>')
})

it('preserves normal script and template code', () => {
  const source =
    '<script setup>\nimport Card from "./Card.vue"\n\nconst value = 1\n</script>\n\n<template>\n  <Card />\n</template>'
  expect(formatBlockSource(source)).toBe(source)
})

it('does not leave a blank first script line when publishing translated preview code', () => {
  const source = `<script setup lang="ts">\nimport { inject } from 'vue'\nconst t = inject('shadcn-uniapp:translate', String)\n\nwithDefaults(defineProps<{ name: string }>(), {})\n</script>`
  expect(removePreviewI18n(source)).toContain('<script setup lang="ts">\nwithDefaults(')
})

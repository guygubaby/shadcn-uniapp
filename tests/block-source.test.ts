import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { blocks } from '../packages/shadcn-uniapp/src/blocks'
import { removePreviewI18n } from '../scripts/block-source.mjs'

it('removes preview translation dependencies from every published block', () => {
  for (const block of blocks) {
    for (const file of block.files) {
      const source = readFileSync(`packages/shadcn-uniapp/registry/${block.name}/${file}`, 'utf8')
      const clean = removePreviewI18n(source)
      expect(clean, block.name).not.toMatch(/shadcn-uniapp:translate|\binject\b|\bt\(/)
      expect(clean, block.name).not.toMatch(/(?:\s|:)style\s*=/)
      expect(clean, block.name).toContain('<template>')
    }
  }
})

it('preserves nested expressions, calculations, validation and component events', () => {
  const source = (name: string, file: string) =>
    removePreviewI18n(readFileSync(`packages/shadcn-uniapp/registry/${name}/${file}`, 'utf8'))

  expect(source('student-switcher', 'StudentSwitcher.vue')).toContain(
    '`${student.grade} · ${student.campus}`',
  )
  expect(source('shopping-cart', 'ShoppingCart.vue')).toContain(
    '`$${(item.priceCents / 100).toFixed(2)} each`',
  )
  expect(source('settings-form', 'SettingsForm.vue')).toContain(
    "message: 'Enter a valid email address'",
  )
  expect(source('profile-card', 'ProfileCard.vue')).toContain('@click="$emit(\'edit\')"')
  expect(source('absence-request', 'AbsenceRequest.vue')).toContain(": 'Select dates',")
  const unrelated = "<script setup>const t = (value) => value; t('keep me')</script>"
  expect(removePreviewI18n(unrelated)).toBe(unrelated)
})

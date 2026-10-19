import { expect, it } from 'vitest'
import { createPreset } from '../packages/shadcn-uniapp/src/theme'
import { decodeThemePreset } from '../packages/shadcn-uniapp/src/preset'
import { createStyleGuidePrompt } from '../apps/site/src/lib/style-guide'

it('carries the selected preset into persistent project instructions and respects the icon choice', () => {
  const theme = { ...createPreset('blue'), radius: 16, font: 'mono' as const }
  const prompt = createStyleGuidePrompt(theme, true)
  const preset = prompt.match(/init --preset (\S+)\./)?.[1]
  expect(preset).toBeDefined()
  expect(decodeThemePreset(preset!)).toEqual({ ...theme, chartColor: theme.light.primary })
  expect(prompt).toContain('UI_STYLE_GUIDE.md')
  expect(prompt).toContain('Preserve all other instructions')
  expect(prompt).toContain('including later theme changes')
  expect(prompt).toContain('Preserve existing UnoCSS')
  expect(prompt).toContain('--sui-primary-foreground')
  expect(prompt).toContain('lucideUniapp()')
  const existingIcons = createStyleGuidePrompt(theme, false)
  expect(existingIcons).toContain('Lucide is disabled')
  expect(existingIcons).not.toContain('Use named imports from @lucide/vue')
  expect(existingIcons).not.toContain('Preserve lucideUniapp()')
})

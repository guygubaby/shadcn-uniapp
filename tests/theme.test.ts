import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  contrastRatio,
  createPreset,
  generateThemeCss,
  getThemeVariables,
  getWotThemeVars,
  parseTheme,
  presetNames,
} from '../packages/shadcn-uniapp/src/theme'

describe('theme contract', () => {
  it('uses the active primary color for charts even when a legacy preset has a separate chart color', () => {
    const theme = { ...createPreset('teal'), chartColor: '#dc2626' }
    for (const mode of ['light', 'dark'] as const)
      expect(getThemeVariables(theme, mode)['--sui-chart']).toBe(theme[mode].primary)
  })

  it.each(presetNames)(
    'generates deterministic light/dark %s styles and concrete portal vars',
    (name) => {
      const theme = createPreset(name)
      expect(parseTheme(JSON.parse(JSON.stringify(theme)))).toEqual(theme)
      expect(generateThemeCss(theme)).toBe(generateThemeCss(theme))
      expect(generateThemeCss(theme)).toContain('.wd-root-portal.wot-theme-dark')
      expect(getWotThemeVars(theme).buttonPrimaryBg).toBe(theme.light.primary)
      expect(getWotThemeVars(theme, 'dark').buttonPrimaryBg).toBe(theme.dark.primary)
      expect(Object.values(getWotThemeVars(theme)).some((value) => value.includes('var('))).toBe(
        false,
      )
      expect(generateThemeCss(theme)).not.toMatch(/undefined|NaN/)
    },
  )

  it('uses only tokens supported by the pinned Wot release', () => {
    const source = readFileSync(
      new URL(
        '../apps/preview/node_modules/@wot-ui/ui/components/wd-config-provider/theme-vars.ts',
        import.meta.url,
      ),
      'utf8',
    )
    const known = new Set([...source.matchAll(/^\s+(\w+)\??:/gm)].map((match) => match[1]))
    const unknown = Object.keys(getWotThemeVars(createPreset())).filter((key) => !known.has(key))
    expect(unknown).toEqual([])
  })
  it('exports checkbox spacing, stacked form fields and square calendar selection', () => {
    const css = generateThemeCss(createPreset())
    expect(css).toContain('.wd-checkbox--vertical + .wd-checkbox--vertical {\n  margin-top: 8px;')
    expect(css).toContain('.wd-cell.wd-form-item > .wd-cell__wrapper {\n  display: block;')
    expect(css).toContain('aspect-ratio: 1;')
    expect(css).toContain('max-width: var(--wot-calendar-view-day-height, 60px);')
    expect(css).toContain('.sui-choice-group {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;')
    expect(css).toContain('--wot-radio-horizontal-margin: 0;')
    expect(css).toContain('--wot-checkbox-horizontal-margin: 0;')
    expect(getWotThemeVars(createPreset()).switchSize).toBe('20px')
    expect(getWotThemeVars({ ...createPreset(), density: 'compact' }).switchSize).toBe('18px')
  })

  it('keeps icon assets out of exported theme styles', () => {
    const css = generateThemeCss(createPreset())
    expect(css).not.toContain('.wd-icon-')
    expect(css).not.toContain('--sui-lucide-icon')
    expect(css).not.toContain('data:image/svg+xml')
  })

  it.each(presetNames)('keeps %s switch thumbs visible in both modes and states', (name) => {
    const theme = createPreset(name)
    for (const mode of ['light', 'dark'] as const) {
      const vars = getWotThemeVars(theme, mode)
      expect(
        contrastRatio(vars.switchColorActionBg!, vars.switchColorActiveBg!),
      ).toBeGreaterThanOrEqual(3)
      expect(
        contrastRatio(vars.switchColorActionBg!, vars.switchColorInactiveBg!),
      ).toBeGreaterThanOrEqual(3)
      expect(generateThemeCss(theme)).toContain(
        `--wot-switch-color-action-bg: ${theme[mode].primaryForeground};`,
      )
    }
  })

  it('rejects CSS injection, incompatible versions, unknown properties, and unsafe names', () => {
    const theme = createPreset()
    expect(() => parseTheme({ ...theme, radius: 100 })).toThrow()
    expect(() => parseTheme({ ...theme, version: 2 })).toThrow()
    expect(() => parseTheme({ ...theme, target: 'wot-v1' })).toThrow()
    expect(() => parseTheme({ ...theme, name: 'x } body {' })).toThrow()
    expect(() => parseTheme({ ...theme, extra: true })).toThrow()
    expect(() =>
      parseTheme({ ...theme, light: { ...theme.light, primary: 'red; color: white' } }),
    ).toThrow()
  })

  it('keeps presets independent and computes WCAG contrast', () => {
    const theme = createPreset()
    theme.light.primary = '#123456'
    expect(createPreset().light.primary).toBe('#18181b')
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21)
    expect(contrastRatio('#ffffff', '#ffffff')).toBe(1)
    expect(contrastRatio('#123456', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', '#123456'))
    expect(getThemeVariables({ ...theme, radius: 0 })['--wot-button-radius-main']).toBe('0px')
  })

  it('separates solid button text from outline and soft text', () => {
    const theme = createPreset('blue')
    for (const mode of ['light', 'dark'] as const) {
      const vars = getWotThemeVars(theme, mode)
      expect(vars.buttonMainColor).toBe(theme[mode].primaryForeground)
      expect(vars.buttonPrimaryColor).toBe(theme[mode].primary)
      expect(vars.buttonDangerColor).toBe(theme[mode].destructive)
    }
  })
})

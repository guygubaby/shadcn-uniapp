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

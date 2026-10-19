import { describe, expect, it } from 'vitest'
import {
  baseColorNames,
  decodeThemePreset,
  encodeThemePreset,
  getBaseColors,
} from '../packages/shadcn-uniapp/src/preset'
import { createPreset, presetNames } from '../packages/shadcn-uniapp/src/theme'

describe('portable Creator presets', () => {
  it('keeps the v1 code stable and decodes the original theme without a server', () => {
    expect(encodeThemePreset(createPreset())).toBe('su1-820')
    expect(decodeThemePreset('su1-820')).toEqual({
      version: 1,
      target: 'wot-v2',
      name: 'shadcn-zinc',
      radius: 8,
      density: 'comfortable',
      font: 'system',
      headingFont: 'system',
      chartColor: '#047857',
      light: {
        background: '#fafafa',
        foreground: '#18181b',
        card: '#ffffff',
        primary: '#18181b',
        primaryForeground: '#fafafa',
        muted: '#f4f4f5',
        mutedForeground: '#6b6b74',
        border: '#e4e4e7',
        destructive: '#dc2626',
        destructiveForeground: '#ffffff',
      },
      dark: {
        background: '#09090b',
        foreground: '#fafafa',
        card: '#18181b',
        primary: '#fafafa',
        primaryForeground: '#18181b',
        muted: '#27272a',
        mutedForeground: '#a1a1aa',
        border: '#3f3f46',
        destructive: '#f87171',
        destructiveForeground: '#18181b',
      },
    })
  })

  it('packs all built-in bases and accents with fonts, radius, density, and chart choices into short codes', () => {
    for (const name of presetNames) {
      expect(decodeThemePreset(name)).toEqual(createPreset(name))
      for (const base of baseColorNames) {
        const colors = getBaseColors(base)
        const theme = {
          ...createPreset(name),
          radius: 24,
          density: 'compact' as const,
          font: 'mono' as const,
          headingFont: 'manrope' as const,
          chartColor: '#be185d',
          light: { ...createPreset(name).light, ...colors.light },
          dark: { ...createPreset(name).dark, ...colors.dark },
        }
        const code = encodeThemePreset(theme)
        expect(code).toMatch(/^su1-[a-z0-9]{1,5}$/)
        expect(decodeThemePreset(code)).toEqual(theme)
      }
    }
  })

  it('preserves custom names and every custom color exactly, with shell-safe output', () => {
    const theme = createPreset('violet')
    theme.name = 'my-school'
    theme.radius = 13
    theme.font = 'mono'
    theme.headingFont = 'manrope'
    theme.chartColor = '#12AbEF'
    for (const mode of ['light', 'dark'] as const) {
      for (const key of Object.keys(theme[mode]) as (keyof typeof theme.light)[])
        theme[mode][key] = mode === 'light' ? '#01aBcD' : '#987654'
    }
    const code = encodeThemePreset(theme)
    expect(code).toMatch(/^su1-[a-z0-9]+\.[A-Za-z0-9_-]+$/)
    expect(decodeThemePreset(code)).toEqual(theme)
    expect(encodeThemePreset(decodeThemePreset(code))).toBe(code)
  })

  it('keeps packed font and chart selections when the extension only changes a name', () => {
    const theme = {
      ...createPreset(),
      name: 'school',
      font: 'mono' as const,
      headingFont: 'manrope' as const,
      chartColor: '#be185d',
    }
    expect(decodeThemePreset(encodeThemePreset(theme))).toEqual(theme)
  })

  it('rejects unknown versions, out-of-range codes, malformed data and unsafe CSS before installation', () => {
    const extra = (value: unknown) =>
      'su1-820.' + Buffer.from(JSON.stringify(value)).toString('base64url')
    for (const code of [
      'missing',
      'su2-820',
      'su1-zzzzz',
      'su1-820.$(echo)',
      'su1-820.abc',
      'su1-' + 'a'.repeat(4096),
      extra({ light: { primary: 'url(https://example.com)' } }),
      extra({ radius: -1 }),
      extra({ name: '../escape' }),
      extra({ target: 'wot-v1' }),
      extra({ light: null }),
      extra({ light: { unknown: '#ffffff' } }),
      extra({ unknown: true }),
      extra([]),
    ])
      expect(() => decodeThemePreset(code), code.slice(0, 80)).toThrow()
    expect(() => encodeThemePreset({ ...createPreset(), radius: 25 })).toThrow()
  })
})

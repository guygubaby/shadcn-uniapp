import type { ColorTokens, ThemeConfig } from './theme'

// These defaults, palettes and their order are the v1 wire format. Use a new version to change them.
const light: ColorTokens = {
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
}
const dark: ColorTokens = {
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
}

export const presetAccents: Record<string, [string, string]> = {
  zinc: ['#18181b', '#fafafa'],
  blue: ['#1d4ed8', '#93c5fd'],
  emerald: ['#047857', '#6ee7b7'],
  rose: ['#be123c', '#fda4af'],
  orange: ['#c2410c', '#fdba74'],
  violet: ['#6d28d9', '#c4b5fd'],
  amber: ['#92400e', '#fcd34d'],
  teal: ['#0f766e', '#5eead4'],
  red: ['#b91c1c', '#fca5a5'],
  pink: ['#be185d', '#f9a8d4'],
}

export const presetTheme: ThemeConfig = {
  version: 1,
  target: 'wot-v2',
  name: 'shadcn-zinc',
  radius: 8,
  density: 'comfortable',
  font: 'system',
  headingFont: 'system',
  chartColor: '#047857',
  light,
  dark,
}

const neutrals = {
  zinc: [
    '#fafafa',
    '#18181b',
    '#ffffff',
    '#f4f4f5',
    '#6b6b74',
    '#e4e4e7',
    '#09090b',
    '#fafafa',
    '#18181b',
    '#27272a',
    '#a1a1aa',
    '#3f3f46',
  ],
  neutral: [
    '#fafafa',
    '#171717',
    '#ffffff',
    '#f5f5f5',
    '#666666',
    '#e5e5e5',
    '#0a0a0a',
    '#fafafa',
    '#171717',
    '#262626',
    '#a3a3a3',
    '#404040',
  ],
  slate: [
    '#f8fafc',
    '#0f172a',
    '#ffffff',
    '#f1f5f9',
    '#58677c',
    '#e2e8f0',
    '#020617',
    '#f8fafc',
    '#0f172a',
    '#1e293b',
    '#94a3b8',
    '#334155',
  ],
  stone: [
    '#fafaf9',
    '#1c1917',
    '#ffffff',
    '#f5f5f4',
    '#6b6460',
    '#e7e5e4',
    '#0c0a09',
    '#fafaf9',
    '#1c1917',
    '#292524',
    '#a8a29e',
    '#44403c',
  ],
  gray: [
    '#f9fafb',
    '#111827',
    '#ffffff',
    '#f3f4f6',
    '#626b79',
    '#e5e7eb',
    '#030712',
    '#f9fafb',
    '#111827',
    '#1f2937',
    '#9ca3af',
    '#374151',
  ],
} as const

export const baseColorNames = Object.keys(neutrals) as (keyof typeof neutrals)[]

export function getBaseColors(value: string): {
  light: Partial<ColorTokens>
  dark: Partial<ColorTokens>
} {
  const values = neutrals[value as keyof typeof neutrals] ?? neutrals.zinc
  const keys = ['background', 'foreground', 'card', 'muted', 'mutedForeground', 'border'] as const
  return {
    light: Object.fromEntries(keys.map((key, i) => [key, values[i]])),
    dark: Object.fromEntries(keys.map((key, i) => [key, values[i + 6]])),
  }
}

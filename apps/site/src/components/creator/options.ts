import { createPreset, presetNames } from 'shadcn-uniapp'
import type { ColorTokens } from 'shadcn-uniapp'

export type PickerOption = { value: string; label: string; color?: string; description?: string }
export type SettingKey =
  'style' | 'base' | 'accent' | 'chart' | 'heading' | 'font' | 'radius' | 'density'

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

export const baseOptions: PickerOption[] = Object.entries(neutrals).map(([value, colors]) => ({
  value,
  label: value[0]!.toUpperCase() + value.slice(1),
  color: colors[1],
}))
export function baseColors(value: string): {
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
export const accentOptions: PickerOption[] = presetNames.map((value) => ({
  value,
  label: value === 'zinc' ? 'Neutral' : value[0]!.toUpperCase() + value.slice(1),
  color: createPreset(value).light.primary,
}))
export const styleOptions: PickerOption[] = [
  { value: 'default', label: 'Default', description: 'Balanced and familiar' },
  { value: 'compact', label: 'Compact', description: 'More room for content' },
  { value: 'rounded', label: 'Rounded', description: 'Soft, generous corners' },
  { value: 'sharp', label: 'Sharp', description: 'Precise, square edges' },
]
export const styles = {
  default: { radius: 8, density: 'comfortable' },
  compact: { radius: 4, density: 'compact' },
  rounded: { radius: 16, density: 'comfortable' },
  sharp: { radius: 0, density: 'compact' },
} as const
export const fontOptions: PickerOption[] = [
  { value: 'system', label: 'System', description: 'Native on every platform' },
  { value: 'manrope', label: 'Manrope', description: 'A geometric sans serif' },
  { value: 'mono', label: 'JetBrains Mono', description: 'Made for technical details' },
]
export const radiusOptions: PickerOption[] = [0, 4, 8, 12, 16, 24].map((value) => ({
  value: String(value),
  label: value ? `${value}px` : 'None',
}))
export const densityOptions: PickerOption[] = [
  { value: 'comfortable', label: 'Comfortable', description: 'A little breathing room' },
  { value: 'compact', label: 'Compact', description: 'For information-rich screens' },
]

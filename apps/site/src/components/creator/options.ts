import { baseColorNames, createPreset, getBaseColors, presetNames } from 'shadcn-uniapp'

export type PickerOption = { value: string; label: string; color?: string; description?: string }
export type SettingKey = 'style' | 'base' | 'accent' | 'heading' | 'font' | 'radius' | 'density'

export const baseOptions: PickerOption[] = baseColorNames.map((value) => ({
  value,
  label: value[0]!.toUpperCase() + value.slice(1),
  color: getBaseColors(value).light.foreground,
}))
export const baseColors = getBaseColors
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

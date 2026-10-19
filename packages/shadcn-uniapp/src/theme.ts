import { z } from 'zod'

const colorSchema = z.string().regex(/^#[\da-f]{6}$/i, 'Use a six-digit hex color, e.g. #18181b')

export const fontNames = ['system', 'manrope', 'mono'] as const
export const fontFamilies: Record<(typeof fontNames)[number], string> = {
  system: '-apple-system, BlinkMacSystemFont, sans-serif',
  manrope: '"Manrope Variable", sans-serif',
  mono: '"JetBrains Mono Variable", monospace',
}

export const colorTokensSchema = z.strictObject({
  background: colorSchema,
  foreground: colorSchema,
  card: colorSchema,
  primary: colorSchema,
  primaryForeground: colorSchema,
  muted: colorSchema,
  mutedForeground: colorSchema,
  border: colorSchema,
  destructive: colorSchema,
  destructiveForeground: colorSchema,
})

export const themeSchema = z.strictObject({
  version: z.literal(1),
  target: z.literal('wot-v2'),
  name: z
    .string()
    .min(1)
    .max(48)
    .regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/),
  radius: z.number().int().min(0).max(24),
  density: z.enum(['comfortable', 'compact']),
  font: z.enum(fontNames).default('system'),
  headingFont: z.enum(fontNames).default('system'),
  // Retained for the immutable v1 preset format; charts follow the active primary color.
  chartColor: colorSchema.default('#047857'),
  light: colorTokensSchema,
  dark: colorTokensSchema,
})

export type ThemeConfig = z.infer<typeof themeSchema>
export type ColorTokens = z.infer<typeof colorTokensSchema>
export type ThemeMode = 'light' | 'dark'

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

export const presetNames = [
  'zinc',
  'blue',
  'emerald',
  'rose',
  'orange',
  'violet',
  'amber',
  'teal',
  'red',
  'pink',
] as const
export type PresetName = (typeof presetNames)[number]

const accents: Record<PresetName, [string, string]> = {
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

export function createPreset(preset: PresetName = 'zinc'): ThemeConfig {
  const [primaryLight, primaryDark] = accents[preset]
  return {
    version: 1,
    target: 'wot-v2',
    name: `shadcn-${preset}`,
    radius: 8,
    density: 'comfortable',
    font: 'system',
    headingFont: 'system',
    chartColor: '#047857',
    light: { ...light, primary: primaryLight },
    dark: { ...dark, primary: primaryDark },
  }
}

export function parseTheme(value: unknown): ThemeConfig {
  return themeSchema.parse(value)
}

function channels(hex: string): [number, number, number] {
  return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16)) as [
    number,
    number,
    number,
  ]
}

function mix(a: string, b: string, weight: number): string {
  const target = channels(b)
  return (
    '#' +
    channels(a)
      .map((value, index) =>
        Math.round(value + (target[index]! - value) * weight)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

export function contrastRatio(a: string, b: string): number {
  colorSchema.parse(a)
  colorSchema.parse(b)
  const luminance = (hex: string) =>
    channels(hex)
      .map((channel) => {
        const s = channel / 255
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      })
      .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index]!, 0)
  const x = luminance(a)
  const y = luminance(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

export function getContrastChecks(config: ThemeConfig, mode: ThemeMode) {
  const c = parseTheme(config)[mode]
  return [
    { name: 'Body / background', ratio: contrastRatio(c.foreground, c.background) },
    { name: 'Primary button', ratio: contrastRatio(c.primaryForeground, c.primary) },
    { name: 'Muted text', ratio: contrastRatio(c.mutedForeground, c.muted) },
    { name: 'Destructive (custom)', ratio: contrastRatio(c.destructiveForeground, c.destructive) },
  ].map((check) => ({ ...check, passes: check.ratio >= 4.5 }))
}

export function getThemeVariables(
  input: ThemeConfig,
  mode: ThemeMode = 'light',
): Record<string, string> {
  const config = parseTheme(input)
  const c = config[mode]
  const radius = `${config.radius}px`
  const vars: Record<string, string> = {
    '--sui-background': c.background,
    '--sui-foreground': c.foreground,
    '--sui-card': c.card,
    '--sui-primary': c.primary,
    '--sui-primary-foreground': c.primaryForeground,
    '--sui-muted': c.muted,
    '--sui-muted-foreground': c.mutedForeground,
    '--sui-border': c.border,
    '--sui-radius': radius,
    '--sui-destructive': c.destructive,
    '--sui-destructive-foreground': c.destructiveForeground,
    '--sui-font-body': fontFamilies[config.font],
    '--sui-font-heading': fontFamilies[config.headingFont],
    '--sui-chart': c.primary,
    '--wot-typography-body-font-family': fontFamilies[config.font],
    '--wot-typography-label-font-family': fontFamilies[config.font],
    '--wot-typography-title-font-family': fontFamilies[config.headingFont],
    '--wot-text-main': c.foreground,
    '--wot-text-secondary': c.mutedForeground,
    '--wot-text-auxiliary': c.mutedForeground,
    '--wot-text-placeholder': c.mutedForeground,
    '--wot-text-disabled': mix(c.foreground, c.card, 0.62),
    '--wot-text-white': '#ffffff',
    '--wot-icon-main': c.foreground,
    '--wot-icon-secondary': c.mutedForeground,
    '--wot-icon-auxiliary': c.mutedForeground,
    '--wot-icon-disabled': mix(c.foreground, c.card, 0.62),
    '--wot-border-main': c.border,
    '--wot-border-strong': mix(c.border, c.foreground, 0.15),
    '--wot-border-light': mix(c.border, c.card, 0.5),
    '--wot-filled-oppo': c.card,
    '--wot-filled-bottom': c.background,
    '--wot-filled-content': c.muted,
    '--wot-filled-strong': c.border,
    '--wot-filled-zero': c.card,
    '--wot-radius-main': radius,
    '--wot-radius-small': `${Math.max(0, config.radius - 2)}px`,
    '--wot-radius-large': `${config.radius + 4}px`,
    '--wot-radius-extra-large': `${config.radius + 6}px`,
    '--wot-button-main-color': c.primaryForeground,
    '--wot-tag-color': c.primaryForeground,
    '--wot-switch-color-action-bg': c.primaryForeground,
    '--wot-switch-color-action-icon': c.primary,
    '--wot-switch-color-active-bg': c.primary,
    '--wot-switch-color-active-icon': c.primaryForeground,
    '--wot-switch-color-inner-active-text': c.primaryForeground,
    '--wot-switch-color-inactive-bg': c.mutedForeground,
    '--wot-switch-color-inactive-icon': c.primaryForeground,
    '--wot-switch-color-inner-inactive-text': c.primaryForeground,
    '--wot-switch-size': config.density === 'compact' ? '18px' : '20px',
    '--wot-button-radius-main': radius,
    '--wot-button-height-medium': config.density === 'compact' ? '32px' : '40px',
    '--wot-button-height-large': config.density === 'compact' ? '40px' : '48px',
    '--wot-tag-radius': `${Math.max(0, config.radius - 2)}px`,
    '--wot-notice-bar-radius': radius,
    '--wot-cell-padding': config.density === 'compact' ? '10px 14px' : '14px 16px',
    '--wot-collapse-item-header-padding': config.density === 'compact' ? '10px 0' : '12px 0',
    '--wot-collapse-item-body-padding': config.density === 'compact' ? '12px 0' : '16px 0',
    '--wot-input-padding': '0 12px',
    '--wot-textarea-padding': '12px',
    '--wot-input-bg': c.card,
    '--wot-input-inner-color': c.foreground,
    '--wot-input-inner-placeholder-color': c.mutedForeground,
    '--wot-input-disabled-color': mix(c.foreground, c.card, 0.62),
    '--wot-input-icon-color': c.mutedForeground,
    '--wot-input-error-color': c.destructive,
    '--wot-input-inner-height': config.density === 'compact' ? '32px' : '40px',
    '--wot-cell-bg': c.card,
    '--wot-cell-bg-active': c.muted,
    '--wot-cell-title-color': c.foreground,
    '--wot-cell-label-color': c.mutedForeground,
    '--wot-cell-value-color': c.mutedForeground,
    '--wot-cell-icon-color': c.mutedForeground,
    '--wot-cell-arrow-color': c.mutedForeground,
    '--wot-cell-border-color': c.border,
    '--wot-cell-theme-color': c.primary,
    '--wot-cell-tap-bg': c.muted,
    '--wot-cell-placeholder-color': c.mutedForeground,
    '--wot-cell-group-bg': c.card,
    '--wot-cell-group-insert-radius': radius,
    '--wot-popup-bg': c.card,
    '--wot-popup-close-color': c.mutedForeground,
    '--wot-popup-radius': `${config.radius + 4}px`,
    '--wot-overlay-bg': mode === 'dark' ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.42)',
  }

  const tones = {
    primary: [c.primary, c.primaryForeground],
    danger: [c.destructive, c.destructiveForeground],
    success: [mode === 'dark' ? '#6ee7b7' : '#047857', mode === 'dark' ? '#052e16' : '#ffffff'],
    warning: [mode === 'dark' ? '#fcd34d' : '#92400e', mode === 'dark' ? '#451a03' : '#ffffff'],
    info: [c.muted, c.foreground],
  }
  for (const [name, [base, text]] of Object.entries(tones)) {
    const color = base!
    if (name === 'primary') {
      for (let i = 1; i <= 10; i++) {
        vars[`--wot-primary-${i}`] =
          i <= 5
            ? mix(c.card, color, [0.05, 0.1, 0.18, 0.3, 0.5][i - 1]!)
            : i === 6
              ? color
              : mix(color, c.background, (i - 6) * 0.09)
      }
    } else if (name !== 'info') {
      Object.assign(vars, {
        [`--wot-${name}-main`]: color,
        [`--wot-${name}-hover`]: mix(color, c.card, 0.08),
        [`--wot-${name}-clicked`]: mix(color, c.background, 0.18),
        [`--wot-${name}-disabled`]: mix(color, c.card, 0.62),
        [`--wot-${name}-surface`]: mix(c.card, color, 0.1),
        [`--wot-${name}-particular`]: mix(color, c.foreground, 0.15),
      })
    }
    const button = `--wot-button-${name}`
    Object.assign(vars, {
      [`${button}-bg`]: color,
      [`${button}-bg-active`]: mix(color, c.card, 0.12),
      [`${button}-color`]: name === 'info' ? c.foreground : color,
      [`${button}-color-active`]: name === 'info' ? c.foreground : color,
      [`${button}-plain-bg`]: c.card,
      [`${button}-plain-bg-active`]: c.muted,
      [`${button}-plain-border`]: name === 'primary' ? c.border : color,
      [`${button}-plain-border-active`]: color,
      [`${button}-soft-bg`]: mix(c.card, color, 0.12),
      [`${button}-soft-bg-active`]: mix(c.card, color, 0.2),
      [`--wot-tag-${name}-bg`]: color,
      [`--wot-tag-${name}-light-bg`]: mix(c.card, color, 0.1),
      [`--wot-tag-${name}-color`]: name === 'info' ? c.foreground : color,
    })
  }
  return vars
}

export function getWotThemeVars(
  config: ThemeConfig,
  mode: ThemeMode = 'light',
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(getThemeVariables(config, mode))
      .filter(([key]) => key.startsWith('--wot-'))
      .map(([key, value]) => [
        key.slice(6).replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase()),
        value,
      ]),
  )
}

export const componentThemeCss = `.wd-checkbox--vertical + .wd-checkbox--vertical {
  margin-top: 8px;
}

.wd-checkbox:not(.is-button) > .wd-checkbox__shape,
.wd-radio:not(.is-button) > .wd-radio__shape {
  align-self: flex-start;
}

.sui-choice-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  --wot-radio-horizontal-margin: 0;
  --wot-checkbox-horizontal-margin: 0;
}

.sui-choice-group .wd-radio,
.sui-choice-group .wd-checkbox {
  max-width: 100%;
}

.wd-tag {
  width: fit-content;
  max-width: 100%;
}

.wd-avatar__text {
  font-size: 0.75em;
  line-height: 1.2;
}

.wd-tooltip .wd-tooltip__pos.wd-tooltip__hidden {
  /* Keep Wot's hidden measurement node from extending the page's scroll height. */
  bottom: 0;
}

.wd-cell.wd-form-item > .wd-cell__wrapper {
  display: block;
}

.wd-cell.wd-form-item > .wd-cell__wrapper > .wd-cell__left {
  /* Wot sets the title width inline, including in vertical forms. */
  min-width: 0 !important;
  max-width: none !important;
  margin-right: 0;
}

.wd-cell.wd-form-item > .wd-cell__wrapper > .wd-cell__right {
  margin-top: 0;
}

.wd-cell.wd-form-item > .wd-cell__wrapper > .wd-cell__left + .wd-cell__right {
  margin-top: 8px;
}

.wd-month__day {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wd-month__day-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: var(--wot-calendar-view-day-height, 60px);
  aspect-ratio: 1;
  line-height: 1;
}

.wd-input,
.wd-textarea {
  box-sizing: border-box;
  border: 1px solid var(--sui-border);
  border-radius: var(--sui-radius);
  transition: border-color 200ms ease-out;
}

.wd-cell.wd-form-item .wd-input.is-compact {
  padding: var(--wot-input-padding);
}

.wd-cell.wd-form-item .wd-textarea.is-compact {
  padding: var(--wot-textarea-padding, 12px);
}

.wd-input:focus-within,
.wd-textarea:focus-within {
  border-color: var(--sui-primary);
}

.wd-input.is-error,
.wd-textarea.is-error {
  border-color: var(--sui-destructive);
}

@media (prefers-reduced-motion: reduce) {
  .wd-input,
  .wd-textarea {
    transition: none;
  }
}`

export function generateThemeCss(input: ThemeConfig): string {
  const config = parseTheme(input)
  const declarations = (mode: ThemeMode) =>
    Object.entries(getThemeVariables(config, mode))
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n')
  return [
    `/* Generated by shadcn-uniapp. Wot UI 2.x. Theme: ${config.name}. */`,
    `:root,\npage,\n.wot-theme-light,\n.wot-theme-${config.name},\n.wd-root-portal.wot-theme-light {\n${declarations('light')}\n}`,
    `.wot-theme-dark,\n.wot-theme-${config.name}-dark,\n.wd-root-portal.wot-theme-dark {\n${declarations('dark')}\n}`,
    'page {\n  background: var(--sui-background);\n  color: var(--sui-foreground);\n  font-family: var(--sui-font-body);\n}',
    componentThemeCss,
    '',
  ].join('\n\n')
}

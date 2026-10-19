import { colorTokensSchema, createPreset, parseTheme, presetNames, themeSchema } from './theme'
import type { ThemeConfig } from './theme'
import { baseColorNames, getBaseColors, presetAccents, presetTheme } from './preset-v1'

export { baseColorNames, getBaseColors } from './preset-v1'

const accentNames = Object.keys(presetAccents)
const fonts = ['system', 'manrope', 'mono'] as const
const densities = ['comfortable', 'compact'] as const
// Field order and radices are part of the v1 wire format.
const radices = [
  baseColorNames.length,
  accentNames.length,
  accentNames.length,
  25,
  2,
  3,
  3,
  accentNames.length,
]
const overridesSchema = themeSchema.partial().extend({
  // A partial override must not reset packed selections to schema defaults.
  font: themeSchema.shape.font.unwrap().optional(),
  headingFont: themeSchema.shape.headingFont.unwrap().optional(),
  chartColor: themeSchema.shape.chartColor.unwrap().optional(),
  light: colorTokensSchema.partial().optional(),
  dark: colorTokensSchema.partial().optional(),
})

function unpack(value: number): ThemeConfig {
  const indexes = Array<number>(radices.length)
  for (let i = radices.length - 1; i >= 0; i--) {
    indexes[i] = value % radices[i]!
    value = Math.floor(value / radices[i]!)
  }
  if (value) throw new Error('Invalid preset code.')
  const [base, accent, chart, radius, density, font, heading, name] = indexes as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ]
  const colors = getBaseColors(baseColorNames[base]!)
  return {
    ...presetTheme,
    name: `shadcn-${accentNames[name]}`,
    radius,
    density: densities[density]!,
    font: fonts[font]!,
    headingFont: fonts[heading]!,
    chartColor: presetAccents[accentNames[chart]!]![0],
    light: {
      ...presetTheme.light,
      ...colors.light,
      primary: presetAccents[accentNames[accent]!]![0],
    },
    dark: { ...presetTheme.dark, ...colors.dark, primary: presetAccents[accentNames[accent]!]![1] },
  }
}

export function encodeThemePreset(input: ThemeConfig): string {
  const theme = parseTheme(input)
  const index = (value: number) => Math.max(0, value)
  const choices = [
    index(
      baseColorNames.findIndex((name) => {
        const colors = getBaseColors(name)
        return (['light', 'dark'] as const).every((mode) =>
          Object.entries(colors[mode]).every(
            ([key, value]) => theme[mode][key as keyof typeof theme.light] === value,
          ),
        )
      }),
    ),
    index(
      accentNames.findIndex(
        (name) =>
          presetAccents[name]![0] === theme.light.primary &&
          presetAccents[name]![1] === theme.dark.primary,
      ),
    ),
    index(accentNames.findIndex((name) => presetAccents[name]![0] === theme.chartColor)),
    theme.radius,
    densities.indexOf(theme.density),
    fonts.indexOf(theme.font),
    fonts.indexOf(theme.headingFont),
    index(accentNames.findIndex((name) => theme.name === `shadcn-${name}`)),
  ]
  const packed = choices.reduce((value, choice, i) => value * radices[i]! + choice, 0)
  const base = unpack(packed)
  const overrides: Record<string, unknown> = {}
  for (const key of Object.keys(theme) as (keyof ThemeConfig)[]) {
    if (key === 'light' || key === 'dark') {
      const colors = Object.fromEntries(
        Object.entries(theme[key]).filter(
          ([token, value]) => base[key][token as keyof typeof theme.light] !== value,
        ),
      )
      if (Object.keys(colors).length) overrides[key] = colors
    } else if (theme[key] !== base[key]) overrides[key] = theme[key]
  }
  const extra = Object.keys(overrides).length
    ? '.' +
      btoa(JSON.stringify(overrides)).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
    : ''
  return `su1-${packed.toString(36)}${extra}`
}

export function decodeThemePreset(code: string): ThemeConfig {
  if ((presetNames as readonly string[]).includes(code))
    return createPreset(code as (typeof presetNames)[number])
  if (code.length > 4096) throw new Error('Preset code must be smaller than 4 KiB.')
  const match = /^su1-([a-z0-9]{1,5})(?:\.([A-Za-z0-9_-]+))?$/.exec(code)
  if (!match) throw new Error('Unknown preset. Use a named preset or a preset code from Creator.')
  const base = unpack(Number.parseInt(match[1]!, 36))
  if (!match[2]) return base
  const overrides = overridesSchema.parse(
    JSON.parse(atob(match[2].replaceAll('-', '+').replaceAll('_', '/'))),
  )
  return parseTheme({
    ...base,
    ...overrides,
    light: { ...base.light, ...overrides.light },
    dark: { ...base.dark, ...overrides.dark },
  })
}

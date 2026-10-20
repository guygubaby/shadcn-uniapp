import { expect, it, vi } from 'vitest'

it('validates runtime themes when the miniapp permits the eval probe but rejects generated parsers', async () => {
  vi.resetModules()
  const { createPreset, parseTheme, getWotThemeVars, themeSchema } =
    await import('../packages/shadcn-uniapp/src/theme')
  const theme = createPreset('zinc')
  const NativeFunction = Function
  vi.stubGlobal(
    'Function',
    new Proxy(NativeFunction, {
      construct(target, args) {
        return args.length === 1 && args[0] === '' ? Reflect.construct(target, args) : {}
      },
    }),
  )
  try {
    expect(() => themeSchema.parse(theme)).toThrow()
    expect(parseTheme(theme)).toEqual(theme)
    expect(getWotThemeVars(theme).primary6).toBe(theme.light.primary)
    expect(() => parseTheme({ ...theme, radius: 999 })).toThrow()
  } finally {
    vi.unstubAllGlobals()
  }
})

import { computed, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '@/lib/i18n'
import { toast } from 'vue-sonner'
import { storeToRefs } from 'pinia'
import { useAppearanceStore } from '@/stores/appearance'
import { createPreset, parseTheme, presetNames } from 'shadcn-uniapp'
import type { ColorTokens, PresetName, ThemeConfig } from 'shadcn-uniapp'
import { baseColors, baseOptions, fontOptions, styles, styleOptions } from './options'
import type { SettingKey } from './options'

export function useCreatorTheme() {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const themeRef = shallowRef(createPreset())
  const { modeRef } = storeToRefs(useAppearanceStore())
  const locksRef = shallowRef(new Set<SettingKey>())
  const selections = computed(() => {
    const theme = themeRef.value
    return {
      style:
        Object.entries(styles).find(
          ([, style]) => style.radius === theme.radius && style.density === theme.density,
        )?.[0] ?? 'custom',
      base:
        baseOptions.find(
          (option) => baseColors(option.value).light.foreground === theme.light.foreground,
        )?.value ?? 'custom',
      accent:
        presetNames.find((name) => createPreset(name).light.primary === theme.light.primary) ??
        'custom',
      chart:
        presetNames.find((name) => createPreset(name).light.primary === theme.chartColor) ??
        'custom',
      font: theme.font,
      heading: theme.headingFont,
      radius: String(theme.radius),
      density: theme.density,
    }
  })
  function persist() {
    void router.replace({
      query: { ...route.query, theme: btoa(JSON.stringify(themeRef.value)), mode: modeRef.value },
    })
  }
  function apply(theme: ThemeConfig) {
    themeRef.value = parseTheme(theme)
    persist()
  }
  function select(key: SettingKey, value: string) {
    const current = themeRef.value
    let next = { ...current }
    if (key === 'style' && value in styles)
      next = { ...next, ...styles[value as keyof typeof styles] }
    if (key === 'base') {
      const colors = baseColors(value)
      next = {
        ...next,
        light: { ...next.light, ...colors.light },
        dark: { ...next.dark, ...colors.dark },
      }
    }
    if (key === 'accent' && presetNames.includes(value as PresetName)) {
      const preset = createPreset(value as PresetName)
      next = {
        ...next,
        light: {
          ...next.light,
          primary: preset.light.primary,
          primaryForeground: preset.light.primaryForeground,
        },
        dark: {
          ...next.dark,
          primary: preset.dark.primary,
          primaryForeground: preset.dark.primaryForeground,
        },
      }
    }
    if (key === 'chart') next.chartColor = createPreset(value as PresetName).light.primary
    if (key === 'radius') next.radius = Number(value)
    if (key === 'font') next.font = value as ThemeConfig['font']
    if (key === 'heading') next.headingFont = value as ThemeConfig['headingFont']
    if (key === 'density') next.density = value as ThemeConfig['density']
    apply(next)
  }
  watch(modeRef, persist)
  function toggleLock(key: SettingKey) {
    const next = new Set(locksRef.value)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    locksRef.value = next
  }
  function shuffle() {
    const pick = <T>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)]!
    const current = themeRef.value
    const locked = (key: SettingKey) => locksRef.value.has(key)
    const style = locked('style')
      ? current
      : styles[pick(styleOptions).value as keyof typeof styles]
    const base = locked('base') ? { light: {}, dark: {} } : baseColors(pick(baseOptions).value)
    const accent = locked('accent') ? current : createPreset(pick(presetNames))
    apply({
      ...current,
      radius: locked('radius') || locked('style') ? current.radius : style.radius,
      density: locked('density') || locked('style') ? current.density : style.density,
      font: locked('font') ? current.font : (pick(fontOptions).value as ThemeConfig['font']),
      headingFont: locked('heading')
        ? current.headingFont
        : (pick(fontOptions).value as ThemeConfig['headingFont']),
      chartColor: locked('chart')
        ? current.chartColor
        : createPreset(pick(presetNames)).light.primary,
      light: {
        ...current.light,
        ...base.light,
        primary: accent.light.primary,
        primaryForeground: accent.light.primaryForeground,
      },
      dark: {
        ...current.dark,
        ...base.dark,
        primary: accent.dark.primary,
        primaryForeground: accent.dark.primaryForeground,
      },
    })
  }
  function color(key: keyof ColorTokens, value: string) {
    apply({
      ...themeRef.value,
      [modeRef.value]: { ...themeRef.value[modeRef.value], [key]: value },
    })
  }
  watch(
    () => [route.query.theme, route.query.mode],
    () => {
      if (typeof route.query.theme === 'string') {
        try {
          if (route.query.theme.length > 4096) throw new Error('Theme URL too large')
          themeRef.value = parseTheme(JSON.parse(atob(route.query.theme)))
        } catch {
          toast.error(t('The linked theme is invalid. Your current theme was kept.'))
        }
      }
      if (route.query.mode === 'dark' || route.query.mode === 'light')
        modeRef.value = route.query.mode
    },
    { immediate: true },
  )
  return {
    themeRef,
    modeRef,
    locksRef,
    selections,
    apply,
    select,
    color,
    toggleLock,
    shuffle,
    reset: () => apply(createPreset()),
  }
}

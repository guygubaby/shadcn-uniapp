import type { ComputedRef, InjectionKey } from 'vue'
import type { ColorTokens } from 'shadcn-uniapp'

export const previewColorsKey: InjectionKey<ComputedRef<ColorTokens>> = Symbol('preview-colors')

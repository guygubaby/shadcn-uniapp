import { describe, expect, it } from 'vitest'
import { chineseMessages, translate } from '../packages/shadcn-uniapp/src/i18n'
import { blocks } from '../packages/shadcn-uniapp/src/blocks'

describe('interface languages', () => {
  it('translates Chinese and preserves English, unknown names, and numbers', () => {
    expect(translate('Use this theme', 'zh-CN')).toBe('使用此主题')
    expect(translate('Use this theme', 'en-US')).toBe('Use this theme')
    expect(translate('My custom workspace', 'zh-CN')).toBe('My custom workspace')
    expect(translate(42, 'zh-CN')).toBe('42')
    expect(translate(undefined, 'zh-CN')).toBe('')
  })
  it('translates editor loading, source, media, and import error states', () => {
    for (const label of [
      'View source',
      'Hide source',
      'Loading...',
      'Play preview',
      'Pause playback',
      'Copy preset code',
      'Preset code',
      'Enter a valid preset code from Creator.',
    ]) {
      expect(translate(label, 'zh-CN')).not.toBe(label)
    }
  })
  it('provides Chinese names and descriptions for every installable block', () => {
    for (const block of blocks) {
      expect(chineseMessages[block.title], block.name).toBeTruthy()
      expect(chineseMessages[block.description], block.name).toBeTruthy()
    }
  })
})

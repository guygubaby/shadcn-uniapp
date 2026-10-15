import { describe, expect, it } from 'vitest'
import { chineseMessages, translate } from '../packages/shadcn-uniapp/src/i18n'
import { blocks } from '../packages/shadcn-uniapp/src/blocks'

describe('interface languages', () => {
  it('translates Chinese and preserves English, unknown names, and numbers', () => {
    expect(translate('Create theme', 'zh-CN')).toBe('创建主题')
    expect(translate('Create theme', 'en-US')).toBe('Create theme')
    expect(translate('My custom workspace', 'zh-CN')).toBe('My custom workspace')
    expect(translate(42, 'zh-CN')).toBe('42')
    expect(translate(undefined, 'zh-CN')).toBe('')
  })
  it('provides Chinese names and descriptions for every installable block', () => {
    for (const block of blocks) {
      expect(chineseMessages[block.title], block.name).toBeTruthy()
      expect(chineseMessages[block.description], block.name).toBeTruthy()
    }
  })
})

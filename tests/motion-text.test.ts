import { describe, expect, it, vi } from 'vitest'
import { splitRevealText } from '../apps/site/src/lib/motion-text'

describe('masked text', () => {
  it('preserves spaces, punctuation, and emoji without duplicating readable text', () => {
    const text = 'Your theme.  你的组件 👩‍💻'
    expect(splitRevealText(text).join('')).toBe(text)
  })
  it('lets Chinese paragraphs wrap between reveal masks', () => {
    const words = splitRevealText('为你的应用创建一套完整的主题')
    expect(words.length).toBeGreaterThan(1)
    expect(Math.max(...words.map((word) => word.length))).toBeLessThan(8)
  })
  it('keeps punctuation attached so animated Chinese does not start a line with a comma', () => {
    const text = '预览真实组件，再将（主题）带回代码。'
    const words = splitRevealText(text)
    expect(words.join('')).toBe(text)
    expect(words.some((word) => /^[，。！？）]/u.test(word))).toBe(false)
    expect(words.some((word) => /[（]$/u.test(word))).toBe(false)
  })
  it('keeps text readable when word segmentation is unavailable', () => {
    vi.stubGlobal('Intl', { Segmenter: undefined })
    try {
      expect(splitRevealText('Theme 主题 👩‍💻')).toEqual(['Theme', ' ', '主题', ' ', '👩‍💻'])
    } finally {
      vi.unstubAllGlobals()
    }
  })
})

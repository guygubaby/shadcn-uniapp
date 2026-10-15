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
  it('keeps text readable when word segmentation is unavailable', () => {
    vi.stubGlobal('Intl', { Segmenter: undefined })
    try {
      expect(splitRevealText('Theme 主题 👩‍💻')).toEqual(['Theme', ' ', '主题', ' ', '👩‍💻'])
    } finally {
      vi.unstubAllGlobals()
    }
  })
})

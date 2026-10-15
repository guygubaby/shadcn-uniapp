export function splitRevealText(text: string): string[] {
  if (typeof Intl.Segmenter === 'function') {
    return Array.from(
      new Intl.Segmenter(undefined, { granularity: 'word' }).segment(text),
      ({ segment }) => segment,
    )
  }
  return text.match(/\s+|\S+/gu) ?? []
}

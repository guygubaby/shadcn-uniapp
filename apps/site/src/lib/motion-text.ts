export function splitRevealText(text: string): string[] {
  const segments =
    typeof Intl.Segmenter === 'function'
      ? Array.from(
          new Intl.Segmenter(undefined, { granularity: 'word' }).segment(text),
          ({ segment }) => segment,
        )
      : (text.match(/\s+|\S+/gu) ?? [])
  return segments.reduce<string[]>((words, word) => {
    const last = words.at(-1)
    if (
      last?.trim() &&
      word.trim() &&
      (/^[\p{Pe}\p{Pf},.!?:;，。！？；：、…%]+$/u.test(word) || /^[\p{Ps}\p{Pi}]+$/u.test(last))
    )
      words[words.length - 1] += word
    else words.push(word)
    return words
  }, [])
}

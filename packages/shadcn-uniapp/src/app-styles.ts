import { parse, type SFCStyleBlock } from '@vue/compiler-sfc'
import MagicString from 'magic-string'

const wotStyles = '@wot-ui/ui/styles/theme/index.scss'

function imports(style: SFCStyleBlock) {
  // Skip comments and unrelated strings so examples do not count as active imports.
  return [
    ...style.content.matchAll(
      /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@(use|import)\s*(['"])([^'"\r\n]+)\2[^;]*;/g,
    ),
  ].filter((match) => match[1])
}

export function addThemeStyles(source: string, filename: string, themePath: string): string {
  const { descriptor, errors } = parse(source, { filename, ignoreEmpty: false })
  if (errors.length) throw new Error(`Cannot update ${filename}: ${String(errors[0])}`)
  const globalStyles = descriptor.styles.filter((style) => !style.scoped && !style.module)
  const compatible = globalStyles.filter(
    (style) =>
      style.lang === 'scss' && !style.src && !/#(?:ifdef|ifndef|endif)\b/.test(style.content),
  )
  const isTheme = (path: string) => path === themePath || path === themePath.replace(/\.scss$/, '')
  const existing = compatible.find((style) => imports(style).some((entry) => isTheme(entry[3]!)))
  const target = compatible.find((style) => style !== existing) ?? existing
  if (existing && target === existing) return source
  const output = new MagicString(source)
  if (existing) {
    const entries = imports(existing)
    const remainder = entries.reduce((text, entry) => text.replace(entry[0], ''), existing.content)
    if (remainder.trim() || entries.some((entry) => !isTheme(entry[3]!) && entry[3] !== wotStyles))
      return source
    // Only consolidate the dedicated block produced by older CLI versions.
    const start = source.lastIndexOf('<style', existing.loc.start.offset)
    const end = source.indexOf('</style>', existing.loc.end.offset) + '</style>'.length
    output.remove(start, end)
  }
  const wot = target && imports(target).find((entry) => entry[3] === wotStyles)
  const hasWot = globalStyles.some(
    (style) => style !== existing && imports(style).some((entry) => entry[3] === wotStyles),
  )
  const wotImport = hasWot ? '' : `@use '${wotStyles}' as *;\n`
  if (target) {
    if (wot) {
      const position = target.loc.start.offset + wot.index! + wot[0].length
      output.appendLeft(position, `\n@${wot[1]} '${themePath}'${wot[1] === 'use' ? ' as *' : ''};`)
    } else {
      output.appendLeft(target.loc.start.offset, `\n${wotImport}@use '${themePath}' as *;\n`)
    }
  } else {
    output.append(`\n\n<style lang="scss">\n${wotImport}@use '${themePath}' as *;\n</style>\n`)
  }
  return output.toString()
}

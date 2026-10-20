import { describe, expect, it } from 'vitest'
import { createRequire } from 'node:module'
import { addThemeStyles } from '../packages/shadcn-uniapp/src/app-styles'

const { parse } = createRequire(new URL('../packages/shadcn-uniapp/package.json', import.meta.url))(
  '@vue/compiler-sfc',
) as typeof import('../packages/shadcn-uniapp/node_modules/@vue/compiler-sfc')
const theme = './theme/shadcn.scss'
const wot = '@wot-ui/ui/styles/theme/index.scss'
const update = (source: string) => addThemeStyles(source, 'src/App.vue', theme)

describe('App.vue theme integration', () => {
  it('reuses a global SCSS block and preserves scripts, comments and existing rules', () => {
    const script = `<script setup>const example = '<style lang="scss">'</script>`
    const source = `${script}\n<style lang="scss">\n/* @use '${theme}'; */\n.keep { color: red; }\n</style>`
    const next = update(source)
    const { descriptor } = parse(next)
    expect(descriptor.styles).toHaveLength(1)
    expect(next).toContain(script)
    expect(next).toContain('.keep { color: red; }')
    expect(descriptor.styles[0]!.content).toContain(`@use '${wot}' as *;`)
    expect(descriptor.styles[0]!.content.indexOf(`@use '${theme}' as *;`)).toBeLessThan(
      next.indexOf('.keep'),
    )
    expect(update(next)).toBe(next)
  })

  it.each(['use', 'import'])('places the theme after an existing Wot @%s', (directive) => {
    const source = `<script>export default {}</script>\n<style lang="scss">\n@${directive} '${wot}'${directive === 'use' ? ' as *' : ''};\n.keep { color: red; }\n</style>`
    const next = update(source)
    expect(parse(next).descriptor.styles).toHaveLength(1)
    expect(next).toContain(`\n@${directive} '${theme}'${directive === 'use' ? ' as *' : ''};`)
    expect(next.indexOf(wot)).toBeLessThan(next.indexOf(theme))
    expect(next.match(/@wot-ui\/ui\/styles\/theme\/index.scss/g)).toHaveLength(1)
  })

  it.each([
    'scoped lang="scss"',
    'module lang="scss"',
    'src="./existing.scss" lang="scss"',
    'lang="less"',
    '',
  ])('preserves incompatible style attributes: %s', (attributes) => {
    const style = attributes.includes('src=')
      ? `<style ${attributes}></style>`
      : `<style ${attributes}>.keep { color: red; }</style>`
    const next = update(`<script>export default {}</script>\n${style}`)
    expect(next).toContain(style)
    expect(parse(next).descriptor.styles).toHaveLength(2)
    expect(update(next)).toBe(next)
  })

  it('consolidates an older generated style block without merging user-owned blocks', () => {
    const source = `<script>export default {}</script>\n<style lang="scss">.keep { color: red; }</style>\n<style lang="scss">@use '${wot}' as *;\n@use '${theme}' as *;</style>`
    const next = update(source)
    expect(parse(next).descriptor.styles).toHaveLength(1)
    expect(next).toContain('.keep { color: red; }')
    expect(next.match(/@use '.\/theme\/shadcn.scss'/g)).toHaveLength(1)
    expect(update(next)).toBe(next)
    const custom = source.replace(
      `@use '${theme}' as *;`,
      `@use '${theme}' as *; .custom { color: blue; }`,
    )
    expect(update(custom)).toBe(custom)
  })

  it('does not accept an import in a comment or scoped block as a global installation', () => {
    const source = `<script>export default {}</script>\n<!-- <style lang="scss">@use '${theme}' as *;</style> -->\n<style scoped lang="scss">@use '${theme}' as *;</style>`
    expect(parse(update(source)).descriptor.styles).toHaveLength(2)
  })

  it('keeps platform-conditional styles intact and installs the theme unconditionally', () => {
    const style = `<style lang="scss">/* #ifdef H5 */\n@use '${wot}' as *;\n/* #endif */</style>`
    const next = update(`<script>export default {}</script>\n${style}`)
    expect(next).toContain(style)
    expect(parse(next).descriptor.styles).toHaveLength(2)
    expect(update(next)).toBe(next)
  })
})

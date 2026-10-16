import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { z } from 'zod'
import { checkedPath, projectRoot, writeFiles } from './project'

const iconDataSchema = z.object({
  node: z.array(
    z.tuple([
      z.string().regex(/^[a-z]+$/),
      z.record(z.string(), z.union([z.string(), z.number()])),
    ]),
  ),
})
const escapeAttribute = (value: string | number) =>
  String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

export async function createLucideIconSources(cwd: string, names: string[]) {
  if (!names.length) throw new Error('Specify Lucide icon names, for example: Search House')
  const require = createRequire(join(projectRoot(cwd), 'package.json'))
  let lucideRoot: string
  try {
    lucideRoot = dirname(require.resolve('@lucide/vue/package.json'))
  } catch {
    throw new Error('Install @lucide/vue first: pnpm add @lucide/vue')
  }
  const exports = readFileSync(join(lucideRoot, 'dist/esm/lucide-vue.mjs'), 'utf8')
  const files = new Map<string, string>()
  for (const match of exports.matchAll(
    /export\s*\{([^}]+)\}\s*from\s*['"](\.\/icons\/[\w-]+\.mjs)['"]/g,
  )) {
    for (const alias of match[1]!.matchAll(/default as (\w+)/g)) files.set(alias[1]!, match[2]!)
  }
  const selected = [...new Set(names)]
  for (const name of selected) {
    if (!/^[A-Z][A-Za-z0-9]*$/.test(name) || !files.has(name))
      throw new Error(`Unknown Lucide icon: ${name}`)
  }
  const license = readFileSync(join(lucideRoot, 'LICENSE'), 'utf8')
  const result: Record<string, string> = { 'LUCIDE-LICENSE': license }
  for (const name of selected) {
    // Lucide v1 exposes data in its ESM icon modules; fail explicitly if that format changes.
    const { __iconData } = await import(
      pathToFileURL(join(lucideRoot, 'dist/esm', files.get(name)!)).href
    )
    const data = iconDataSchema.parse(__iconData)
    const nodes = data.node
      .map(([tag, attributes]) => {
        const attrs = Object.entries(attributes)
          .filter(([key]) => key !== 'key')
          .map(([key, value]) => `${key}="${escapeAttribute(value)}"`)
          .join(' ')
        return `<${tag} ${attrs}/>`
      })
      .join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${nodes}</svg>`
    result[`${name}.vue`] = `<!-- Generated from @lucide/vue. ISC license; see LUCIDE-LICENSE. -->
<script setup lang="ts">
// #ifndef MP
import { ${name} as SourceIcon } from '@lucide/vue'
// #endif
// #ifdef MP
import { computed } from 'vue'
// #endif

defineOptions({ options: { virtualHost: true, addGlobalClass: true, styleIsolation: 'shared' } })
const props = withDefaults(defineProps<{ size?: number; color?: string; strokeWidth?: number; label?: string }>(), { size: 24, color: 'currentColor', strokeWidth: 2 })

// #ifdef MP
const svg = ${JSON.stringify(svg)}
const iconStyleRef = computed(() => {
  const stroke = Number.isFinite(props.strokeWidth) ? Math.max(0, props.strokeWidth) : 2
  const mask = 'url("data:image/svg+xml,' + encodeURIComponent(svg.replace('stroke-width="2"', 'stroke-width="' + stroke + '"')) + '") center / contain no-repeat'
  return {
    display: 'inline-block', flexShrink: 0, verticalAlign: 'middle',
    width: props.size + 'px', height: props.size + 'px', backgroundColor: props.color,
    mask, WebkitMask: mask,
  }
})
// #endif
</script>
<template>
  <!-- #ifndef MP -->
  <SourceIcon :size="size" :color="color" :stroke-width="strokeWidth" :aria-label="label" :aria-hidden="label ? undefined : true" />
  <!-- #endif -->
  <!-- #ifdef MP -->
  <view :aria-label="label" :aria-hidden="!label" :style="iconStyleRef" />
  <!-- #endif -->
</template>
`
  }
  return result
}

export async function generateLucideIcons(cwd: string, names: string[], force = false) {
  const root = projectRoot(cwd)
  const directory = existsSync(join(root, 'src/App.vue'))
    ? 'src/components/lucide'
    : 'components/lucide'
  const sources = await createLucideIconSources(root, names)
  const licensePath = `${directory}/LUCIDE-LICENSE`
  const licenseFile = checkedPath(root, licensePath)
  const allowed = new Set<string>()
  if (existsSync(licenseFile) && readFileSync(licenseFile, 'utf8') === sources['LUCIDE-LICENSE'])
    allowed.add(licensePath)
  return writeFiles(
    root,
    Object.fromEntries(
      Object.entries(sources).map(([name, source]) => [`${directory}/${name}`, source]),
    ),
    force,
    allowed,
  )
}

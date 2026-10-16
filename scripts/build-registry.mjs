import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { removePreviewI18n } from './block-source.mjs'
import {
  blocks,
  componentThemeCss,
  createPreset,
  generateThemeCss,
  presetNames,
} from '../packages/shadcn-uniapp/dist/index.js'

const root = new URL('../', import.meta.url)
const output = new URL('apps/site/public/r/', root)
await rm(output, { recursive: true, force: true })
await rm(new URL('apps/preview/src/blocks/', root), { recursive: true, force: true })
await mkdir(output, { recursive: true })
for (const block of blocks) {
  const files = await Promise.all(
    block.files.map(async (file) => ({
      path: `registry/${block.name}/${file}`,
      type: file.endsWith('.vue') ? 'registry:component' : 'registry:file',
      target: `src/components/blocks/${block.name}/${file}`,
      content: await readFile(
        new URL(`packages/shadcn-uniapp/registry/${block.name}/${file}`, root),
        'utf8',
      ),
    })),
  )
  await writeFile(
    new URL(`${block.name}.json`, output),
    JSON.stringify(
      {
        $schema: 'https://shadcn-vue.com/schema/registry-item.json',
        name: block.name,
        title: block.title,
        description: block.description,
        type: 'registry:block',
        dependencies: ['@wot-ui/ui@^2.3.2', '@lucide/vue@^1.57.0'],
        files: files.map((file) => ({ ...file, content: removePreviewI18n(file.content) })),
        docs: 'Requires uni-app Vue 3, Wot UI 2.x easycom, and a shadcn-uniapp theme. Preserve the project styling system: UnoCSS is supported; new projects may choose Tailwind CSS v4 + weapp-tailwindcss. Blocks importing @lucide/vue need lucideUniapp() from shadcn-uniapp/vite before uni() for miniapps (Vite 5 supported). This is not a desktop Reka component.',
      },
      null,
      2,
    ) + '\n',
  )
  // Miniapp builds require SFCs to stay inside the uni-app source root.
  const previewBlock = new URL(`apps/preview/src/blocks/${block.name}/`, root)
  await mkdir(previewBlock, { recursive: true })
  for (const [index, file] of block.files.entries()) {
    await writeFile(new URL(file, previewBlock), files[index].content)
  }
}
const themes = new URL('apps/site/public/themes/', root)
await mkdir(themes, { recursive: true })
await writeFile(new URL('apps/preview/src/theme.scss', root), componentThemeCss)
for (const preset of presetNames) {
  const theme = createPreset(preset)
  await writeFile(new URL(`${preset}.json`, themes), JSON.stringify(theme, null, 2) + '\n')
  await writeFile(new URL(`${preset}.scss`, themes), generateThemeCss(theme))
}
console.log(
  `Built ${blocks.length} registry entries and ${presetNames.length} themes in ${fileURLToPath(output)}`,
)

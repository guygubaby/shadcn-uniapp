import { mkdir, writeFile } from 'node:fs/promises'
import { createLucideIconSources } from '../packages/shadcn-uniapp/dist/icons.js'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const components = [
  [
    'apps/preview/src/components/lucide/',
    [
      'CircleCheck',
      'House',
      'Settings',
      'UserRound',
      'Search',
      'Gift',
      'CreditCard',
      'Pencil',
      'Lightbulb',
      'Headphones',
      'CalendarDays',
      'FileText',
      'Mail',
      'LayoutGrid',
    ],
  ],
  [
    'packages/shadcn-uniapp/registry/quick-actions/',
    ['CalendarDays', 'FileText', 'Mail', 'Pencil', 'UserRound', 'LayoutGrid'],
  ],
  ['packages/shadcn-uniapp/registry/document-list/', ['FileText']],
  ['packages/shadcn-uniapp/registry/survey-card/', ['CalendarDays']],
]
for (const [path, names] of components) {
  const directory = new URL(path, root)
  await mkdir(directory, { recursive: true })
  const sources = await createLucideIconSources(
    fileURLToPath(new URL('apps/preview/', root)),
    names,
  )
  for (const [name, source] of Object.entries(sources))
    await writeFile(new URL(name, directory), source)
}

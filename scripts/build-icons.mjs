import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const require = createRequire(new URL('../apps/preview/package.json', import.meta.url))
const lucideRoot = dirname(require.resolve('@lucide/vue/package.json'))
const wotRoot = dirname(require.resolve('@wot-ui/ui/package.json'))
const font = await readFile(join(wotRoot, 'components/wd-icon/iconfont.scss'), 'utf8')
const names = new Set([...font.matchAll(/\.wd-icon-([\w-]+)/g)].map((match) => match[1]))
names.add('search')
const exports = await readFile(join(lucideRoot, 'dist/esm/lucide-vue.mjs'), 'utf8')
const publicIcons = new Map()
for (const match of exports.matchAll(/export \{ ([^}]+) \} from '\.\/icons\/([^']+)\.mjs'/g)) {
  for (const alias of match[1].matchAll(/default as (\w+)/g)) {
    publicIcons.set(alias[1].replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(), match[2])
  }
}

const aliases = {
  branch: 'git-branch',
  'code-block': 'code-xml',
  dashboard: 'layout-dashboard',
  dice: 'dice-5',
  'file-pdf': 'file-text',
  highlight: 'highlighter',
  stop: 'square',
  thunderbolt: 'zap',
  expand: 'maximize',
  del: 'delete',
  'multiple-horizontal': 'chevrons-left-right',
  left: 'chevron-left',
  right: 'chevron-right',
  up: 'chevron-up',
  down: 'chevron-down',
  'left-circle': 'circle-chevron-left',
  'right-circle': 'circle-chevron-right',
  'up-circle': 'circle-chevron-up',
  'down-circle': 'circle-chevron-down',
  'caret-down': 'chevron-down',
  'caret-right': 'chevron-right',
  'caret-left': 'chevron-left',
  'caret-up': 'chevron-up',
  'double-left': 'chevrons-left',
  'double-right': 'chevrons-right',
  'double-up': 'chevrons-up',
  'double-down': 'chevrons-down',
  'arrow-rise': 'trending-up',
  'arrow-fall': 'trending-down',
  'to-right': 'arrow-right-to-line',
  'to-left': 'arrow-left-to-line',
  'to-top': 'arrow-up-to-line',
  'to-bottom': 'arrow-down-to-line',
  'menu-fold': 'panel-left-close',
  'menu-unfold': 'panel-left-open',
  swap: 'arrow-right-left',
  'drag-arrow': 'move',
  'sort-fill': 'arrow-down-up',
  'sort-fill-1': 'arrow-down-up',
  'rotate-left': 'rotate-ccw',
  'rotate-right': 'rotate-cw',
  shrink: 'minimize',
  deleteall: 'list-x',
  brush: 'paintbrush',
  'font-colors': 'baseline',
  edit: 'square-pen',
  filter: 'list-filter',
  'filter-fill': 'list-filter',
  'find-replace': 'replace',
  delete: 'trash-2',
  circular: 'circle',
  'bg-colors': 'paint-bucket',
  'unordered-list': 'list',
  'ordered-list': 'list-ordered',
  'original-size': 'maximize-2',
  'sort-ascending': 'arrow-up-narrow-wide',
  'sort-descending': 'arrow-down-wide-narrow',
  scissor: 'scissors',
  'oblique-line': 'slash',
  'line-height': 'a-arrow-up',
  h7: 'heading',
  apps: 'layout-grid',
  application: 'app-window',
  'no-wifi': 'wifi-off',
  'no-result': 'search-x',
  'no-product': 'package-open',
  'no-message': 'message-square-off',
  'no-content': 'file-x',
  'no-comment': 'message-circle-off',
  'no-collection': 'folder-open',
  failpayment: 'credit-card',
  formula: 'sigma',
  sort: 'arrow-down-up',
  textarea: 'text-cursor-input',
  paste: 'clipboard-paste',
  number: 'hash',
  'drag-dot': 'grip-horizontal',
  'drag-dot-vertical': 'grip-vertical',
  'drive-file': 'folder-open',
  email: 'mail',
  common: 'shapes',
  desktop: 'monitor',
  company: 'building-2',
  'calendar-line': 'calendar-days',
  bulb: 'lightbulb',
  'image-failloading': 'image-off',
  interaction: 'mouse-pointer-click',
  'image-close': 'image-off',
  Fire: 'flame',
  idcard: 'contact-round',
  'folder-add': 'folder-plus',
  'folder-delete': 'folder-x',
  'face-frown': 'frown',
  'face-meh': 'meh',
  'face-smile': 'smile',
  experiment: 'flask-conical',
  empty: 'inbox',
  mobile: 'smartphone',
  'mind-mapping': 'workflow',
  location: 'map-pin',
  loop: 'repeat',
  language: 'languages',
  locate: 'locate-fixed',
  loading: 'loader-circle',
  pen: 'pen-line',
  organization: 'network',
  'notification-close': 'bell-off',
  'old-version': 'history',
  notification: 'bell',
  nav: 'navigation',
  mosaic: 'grid-2x2',
  man: 'mars',
  store: 'store',
  subscribed: 'bell-ring',
  subscribe: 'bell',
  skin: 'shirt',
  storage: 'database',
  'subscribe-add': 'bell-plus',
  shake: 'vibrate',
  safe: 'shield-check',
  public: 'globe',
  robot: 'bot',
  'robot-add': 'bot-message-square',
  pushpin: 'pin',
  qrcode: 'qr-code',
  Export: 'log-out',
  import: 'log-in',
  'clock-circle': 'clock',
  'buble-circle': 'message-circle',
  at: 'at-sign',
  tool: 'wrench',
  woman: 'venus',
  'video-camera': 'video',
  'user-group': 'users',
  'time-line': 'clock',
  'user-add': 'user-plus',
  refresh: 'refresh-cw',
  more: 'ellipsis',
  'more-vertical': 'ellipsis-vertical',
  module: 'blocks',
  mfill: 'blocks',
  message: 'message-square',
  'message-banned': 'message-square-off',
  'lightning-circle': 'zap',
  Launch: 'rocket',
  headset: 'headphones',
  'headset-off': 'headphone-off',
  'eye-invisible': 'eye-off',
  'live-broadcast': 'radio',
  fullscreen: 'maximize',
  'fullscreen-exit': 'minimize',
  forward: 'fast-forward',
  backward: 'rewind',
  voice: 'audio-lines',
  translate: 'languages',
  'thumb-up': 'thumbs-up',
  'thumb-down': 'thumbs-down',
  sync: 'refresh-cw',
  'share-internal': 'share',
  'share-external': 'external-link',
  'share-alt': 'share-2',
  'select-all': 'square-dashed',
  poweroff: 'power',
  'search-line': 'search',
  'check-half-square': 'square-minus',
  'check-circle-radio': 'circle-dot',
  'skip-next': 'skip-forward',
  'skip-previous': 'skip-back',
  sound: 'volume-2',
  'record-stop': 'square',
  record: 'circle',
  'play-arrow': 'play',
  mute: 'volume-x',
  page: 'file-text',
  'minus-square': 'square-minus',
  'minus-square-3px': 'square-minus',
  'minus-circle': 'circle-minus',
  info: 'info',
  'info-circle': 'info',
  exclamation: 'circle-alert',
  'exclamation-polygon': 'triangle-alert',
  'exclamation-circle': 'circle-alert',
  doublecheck: 'check-check',
  close: 'x',
  division: 'divide',
  'close-circle': 'circle-x',
  'check-square': 'square-check',
  'uncheck-square': 'square',
  'uncheck-circle': 'circle',
  'question-circle': 'circle-help',
  question: 'circle-help',
  'plus-square-3px': 'square-plus',
  'plus-square': 'square-plus',
  'plus-circle': 'circle-plus',
}
for (let i = 1; i <= 6; i++) aliases[`h${i}`] = `heading-${i}`
const groups = new Map()
const missing = []
for (const name of [...names].sort()) {
  const base = name.replace(/-fill$/, '')
  const selected = aliases[name] ?? aliases[base] ?? base
  const iconName =
    publicIcons.get(selected) ?? publicIcons.get(selected.replace(/-(\d)/g, '$1')) ?? selected
  let data
  try {
    data = (await import(pathToFileURL(join(lucideRoot, `dist/esm/icons/${iconName}.mjs`)).href))
      .__iconData
  } catch {
    missing.push(`${name} -> ${iconName}`)
    continue
  }
  if (!data?.node) throw new Error(`No SVG data for ${iconName}`)
  const nodes = data.node
    .map(
      ([tag, attrs]) =>
        `<${tag} ${Object.entries(attrs)
          .filter(([key]) => key !== 'key')
          .map(([key, value]) => `${key}="${value}"`)
          .join(' ')}/>`,
    )
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${nodes}</svg>`
  if (!groups.has(svg)) groups.set(svg, [])
  groups.get(svg).push(name)
}
if (missing.length) throw new Error(`Missing Lucide mappings: ${missing.join(', ')}`)
const css =
  `/* Lucide icons from @lucide/vue. Copyright Lucide contributors. ISC license. */
.wd-icon:not(.wd-icon--css):not(.wd-icon--image)::before {
  content: '';
  width: 1em;
  height: 1em;
  vertical-align: top;
  background-color: currentColor;
  -webkit-mask: var(--sui-lucide-icon) center / contain no-repeat;
  mask: var(--sui-lucide-icon) center / contain no-repeat;
}
` +
  [...groups]
    .map(
      ([svg, items]) =>
        `${items.map((name) => `.wd-icon-${name}::before`).join(',\n')} {\n  --sui-lucide-icon: url("data:image/svg+xml,${encodeURIComponent(svg)}");\n}`,
    )
    .join('\n')
await writeFile(
  new URL('../packages/shadcn-uniapp/src/lucide-icons.ts', import.meta.url),
  `// Generated by scripts/build-icons.mjs from @lucide/vue; do not edit.\nexport const lucideThemeCss = ${JSON.stringify(css)}\n`,
)
console.log(`Mapped ${names.size} Wot icon names to ${groups.size} Lucide SVGs.`)

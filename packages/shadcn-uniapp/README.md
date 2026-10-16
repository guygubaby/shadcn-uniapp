# shadcn-uniapp

Shadcn-inspired themes and source-owned blocks for **Wot UI 2.x + uni-app**.

[Website](https://shadcn-uniapp.guygubaby.top) | [Creator](https://shadcn-uniapp.guygubaby.top/create) | [Documentation](https://shadcn-uniapp.guygubaby.top/docs) | [GitHub](https://github.com/guygubaby/shadcn-uniapp)

## Use

In an existing Vue 3 / uni-app project with npm-installed `@wot-ui/ui` 2.x, Wot easycom and Sass:

Blocks use Tailwind CSS v4 utility classes. Configure Tailwind CSS v4 in your project; for uni-app miniapps, use the [weapp-tailwindcss Vite integration](https://tw.weapp.dev/zh-cn/docs/quick-start/frameworks/uni-app-vite).

```sh
pnpm add -D shadcn-uniapp sass
pnpm exec shadcn-uniapp init --preset zinc
pnpm exec shadcn-uniapp add profile-card
```

Use `init --theme ./shadcn.theme.json` to initialize from a Creator export.

Edit `src/theme/shadcn.theme.json`, or export validated JSON from Creator to that path, then:

```sh
pnpm exec shadcn-uniapp generate
```

Presets: zinc, blue, emerald, rose, orange, violet, amber, teal, red, pink. Blocks: profile-card, settings-form, filter-list.

`init` preserves existing App.vue content and appends theme imports. Existing generated files are protected unless `--force` is passed. `generate` replaces only the configured generated stylesheet. No dependency is installed and no Wot code is patched.

CLI options: `--cwd <directory>`, `--force`, `--help`. Node.js 20.19+ required.

## Runtime API

Install as a normal dependency when importing in application code.

```ts
import { createPreset, generateThemeCss, getWotThemeVars, parseTheme } from 'shadcn-uniapp'

const theme = parseTheme(createPreset('blue'))
const css = generateThemeCss(theme)
const themeVars = getWotThemeVars(theme, 'dark')
```

Pass `themeVars` to Wot ConfigProvider with `theme="dark"`. The adapter emits concrete Wot variables for detached portals. Handle page background/text separately. No raw HTML or unvalidated CSS is accepted by theme JSON.

## Scope

Verified token adapter for Wot UI 2.3.2. No Wot v1 or uni_modules CLI adapter, no native App target, and no full desktop shadcn-vue compatibility. H5 preview is not WeChat real-device verification. Existing business color overrides may need adjustment.

MIT. Independent community project, not an official Wot or shadcn product.

### Icons and new miniapps

Install icons with `pnpm add @lucide/vue`. Import `lucideUniapp` from `shadcn-uniapp/vite` and register `lucideUniapp()` before the existing `uni()` plugin. The plugin supports Vite 5. Keep ordinary imports such as `import { Search } from '@lucide/vue'`.

The Vite plugin entry supports both ESM and CommonJS starting with 0.1.1, including static imports in `vite.config.ts` without changing the project's package.json module type. On 0.1.0, use `await import('shadcn-uniapp/vite')` inside an async Vite config callback when the config loads as CommonJS.

H5 uses the official Lucide component unchanged. Miniapp builds and watch mode automatically adapt named icon imports to native `view` components with inline masks. Use `size`, `color`, and `stroke-width` for portable styling. Only imported icons and their license are cached in `src/shadcn-lucide/`; add `shadcn-lucide/` to `.gitignore`. Aliases and type-only imports are supported. No icon generation command is required.

Theme exports contain no icon assets or global Wot icon replacements. Wot's private internal icons keep their defaults. SVG DOM APIs, children, filters, and SVG animation are not polyfilled. WeChat compilation is checked; real-device rendering is not yet verified. GitHub keeps its brand logo because Lucide v1 does not contain brand icons.

For a new uni-app miniapp, use **Tailwind CSS v4 + weapp-tailwindcss** with the [official uni-app Vite setup](https://tw.weapp.dev/zh-cn/docs/quick-start/frameworks/uni-app-vite). Preserve existing projects' styling system.

Existing UnoCSS projects are also supported. Theme initialization preserves the existing utility framework. The website's AI setup entry can generate installation instructions for existing styling, Tailwind v4, or UnoCSS, with Lucide enabled or disabled.

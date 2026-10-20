# shadcn-uniapp

Shadcn-inspired themes and source-owned blocks for **Wot UI 2.x + uni-app**.

[Website](https://shadcn-uniapp.guygubaby.top) | [Creator](https://shadcn-uniapp.guygubaby.top/create) | [Documentation](https://shadcn-uniapp.guygubaby.top/docs) | [GitHub](https://github.com/guygubaby/shadcn-uniapp)

## v0.1.4

Initialization reuses compatible global SCSS in App.vue instead of always adding another style block. `generate` can consolidate a dedicated theme block created by an older CLI. Runtime theme validation skips Zod's generated object parser for miniapp compatibility. New style guides include an explicit workflow for adopting the selected theme across existing UI; customized guides remain protected.

Existing projects should upgrade the package and run `pnpm exec shadcn-uniapp generate`. Existing customized guides are preserved; merge new adoption rules into them deliberately.

## Use

In an existing Vue 3 / uni-app project with npm-installed `@wot-ui/ui` 2.x, Wot easycom and Sass:

Blocks use Tailwind CSS v4 utility classes. Configure Tailwind CSS v4 in your project; for uni-app miniapps, use the [weapp-tailwindcss Vite integration](https://tw.weapp.dev/zh-cn/docs/quick-start/frameworks/uni-app-vite).

```sh
pnpm add -D shadcn-uniapp sass
pnpm exec shadcn-uniapp init --preset zinc
pnpm exec shadcn-uniapp add profile-card
```

In Creator, choose **Use this theme** and copy the preset command:

```sh
pnpm dlx shadcn-uniapp@latest init --preset su1-820
```

Preset codes resolve locally and contain all theme settings. Common choices use a short code; custom names and colors add an encoded extension. Codes do not expire or require a backend. `su1-820` is the default zinc theme. `init --theme <file>` remains available for existing JSON workflows.

Creator also provides **Copy preset code** and **Open preset** for reusing themes. To edit the installed theme locally, change `src/theme/shadcn.theme.json`, then:

```sh
pnpm exec shadcn-uniapp generate
```

Presets: zinc, blue, emerald, rose, orange, violet, amber, teal, red, pink. Includes 28 source-owned blocks for mobile apps and international schools; see the [Blocks catalog](https://shadcn-uniapp.guygubaby.top/blocks) for names and previews.

`init` preserves App.vue and inserts theme imports into an existing global inline SCSS block when compatible. Scoped, CSS-module, external or other-language styles stay intact; a separate global SCSS block is added in those cases. `generate` also consolidates an older CLI-only theme block when a compatible SCSS block exists. It creates `UI_STYLE_GUIDE.md` and links it from `AGENTS.md`. Existing style-guide edits and agent instructions are preserved, including with `--force`.

Existing page design is not rewritten by installation. Ask your coding agent to follow the guide's adoption workflow: consolidate old ConfigProvider overrides and utility tokens, refactor shared UI, then migrate the requested screens and inspect them visually. In monorepos, link the guide from the root agent rules too.

For projects initialized with an older version, run `generate` to refresh the stylesheet and add missing guidance. Existing generated theme and block files are protected unless `--force` is passed. No dependency is installed and no Wot code is patched.

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

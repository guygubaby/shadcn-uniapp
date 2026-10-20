# shadcn-uniapp

Shadcn-inspired themes, a visual theme creator, and editable source blocks for **Wot UI 2.x + uni-app**.

- Website: https://shadcn-uniapp.guygubaby.top
- Creator: https://shadcn-uniapp.guygubaby.top/create
- Source: https://github.com/guygubaby/shadcn-uniapp

Keep your `wd-*` components. Generate a theme instead of replacing the component library.

## What ships in v0.1.4

- Ten light/dark accent presets, including zinc, blue, emerald, rose, and orange.
- Validated theme JSON, semantic CSS variables and a Wot v2 token adapter.
- Compact accordion alignment with density-aware content padding, and a fix for hidden Tooltip measurement causing empty page space.
- CLI commands: `init`, `generate`, `add`.
- Safe App.vue SCSS integration, legacy generated-block consolidation, and runtime theme validation without generated object parsers.
- A persistent `UI_STYLE_GUIDE.md`, linked from `AGENTS.md`, for future AI-assisted UI work.
- 28 source-owned blocks for mobile apps, parent services, and teacher workflows.
- A prerendered Vue website using shadcn-vue, plus a real, separately compiled uni-app H5 preview.
- Creator with color/radius/density editing, contrast hints, portable preset codes and copyable SCSS.

No Wot v1 adapter, dependency patching, backend, account system or cloud theme storage is included. Preset codes are processed locally.

## Requirements

Consumer projects: Vue 3 + uni-app, npm-installed `@wot-ui/ui` **2.x** (verified against 2.3.2), existing Wot easycom and Sass configuration. CLI: Node.js 20.19+. This repository: Node.js 22.18+ (24.x recommended) and pnpm 10.32.1.

`uni_modules` installation and Wot v1 are not supported by this CLI. Do not upgrade your component library just to run it. H5 previews do not establish WeChat real-device compatibility.

## Installation

Install the latest release from npm.

```sh
pnpm add -D shadcn-uniapp sass
pnpm exec shadcn-uniapp init --preset zinc
pnpm exec shadcn-uniapp add profile-card
```

`init` creates:

```text
shadcn-uniapp.json
UI_STYLE_GUIDE.md
AGENTS.md
src/theme/shadcn.theme.json
src/theme/shadcn.scss
```

It reuses an existing unscoped inline SCSS block in `App.vue`, preserving scripts and styles and placing the theme after the Wot import. A separate global SCSS block is added only when the existing styles use incompatible scope, language or external sources. An existing generated theme file aborts the operation before changes; `--force` is an explicit overwrite. No dependency is automatically installed.

`UI_STYLE_GUIDE.md` tells coding agents to read the current theme and reuse shared components, spacing and layout conventions. Existing guide edits and agent rules are preserved, including with `--force`. For an older initialized project, `generate` adds missing guidance automatically.

Existing pages need an explicit visual migration: remove competing ConfigProvider colors and legacy theme overrides, connect utility tokens to the selected theme, and refactor shared UI before adapting page layouts. Installing a stylesheet or generating an agent guide alone does not redesign those pages. Link the guide from the monorepo root rules when that is the agent's entry point.

```vue
<style lang="scss">
@use '@wot-ui/ui/styles/theme/index.scss' as *;
@use './theme/shadcn.scss' as *;
</style>
```

Initialize with the preset command copied from Creator. To update an installed theme locally, edit the configured theme JSON, then run:

```sh
pnpm exec shadcn-uniapp generate
```

Do not hand-edit generated SCSS: the next `generate` replaces it. Keep hand-written overrides in a separate file.

## Blocks

```sh
pnpm exec shadcn-uniapp add profile-card
pnpm exec shadcn-uniapp add settings-form
pnpm exec shadcn-uniapp add filter-list
```

Source is copied to `src/components/blocks/<name>`. Blocks use Tailwind CSS v4 utility classes for layout and typography, alongside the existing Wot easycom configuration. Configure Tailwind CSS v4 in the consuming project; uni-app miniapps should use the [weapp-tailwindcss Vite integration](https://tw.weapp.dev/zh-cn/docs/quick-start/frameworks/uni-app-vite). Theme colors and radii use the generated `--sui-*` variables.

- `ProfileCard`: `name`, `description`, `workspace`; emits `edit`.
- `SettingsForm`: initial `email` / `notifications` and optional `loading`; validates locally and emits `save`. It never sends an API request. Use a new component key if switching the edited account.
- `FilterList`: `items: { id, title, description? }[]`; emits `select` with the selected ID.

## Runtime themes

Install `shadcn-uniapp` as a normal dependency if importing it in application code, rather than using it only as a dev CLI.

```ts
import { parseTheme, getWotThemeVars, getThemeVariables } from 'shadcn-uniapp'
import themeJson from './theme/shadcn.theme.json'

const theme = parseTheme(themeJson)
const themeVars = getWotThemeVars(theme, 'dark')
const pageVars = getThemeVariables(theme, 'dark')
```

Pass `theme="dark"` and `:theme-vars="themeVars"` to `wd-config-provider`. Apply page background/text yourself. The Wot mapping uses concrete colors so detached RootPortal content does not depend on custom variables defined only on a page. Theme files target `page`, global/default providers and portals; hardcoded color props or deep CSS overrides can still win.

## Develop locally

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` builds the package, Registry and uni-app H5 preview before starting the website. If editing preview or Registry sources, rebuild those artifacts or rerun `pnpm dev`.

```sh
pnpm check
pnpm pack:release
```

## Repository

```text
packages/shadcn-uniapp/   Theme schema, generator, CLI, bundled block sources
apps/site/               Vue 3 / Vite 8 / Tailwind 4 / shadcn-vue website
apps/preview/            Isolated uni-app / Vite 5 / Wot UI 2.3.2 H5 preview
tests/                   Theme, token compatibility and safe installation tests
docs/                    Research, publishing and deployment notes
```

The preview pins the Vue/Vite versions required by the uni-app compiler, independently of the website. It is an H5 preview host with a WeChat compile fixture, not a claim of real-device verification. Existing consumer styling is preserved.

## Publish and deploy

- [Manual npm release](docs/publishing.md)
- [Cloudflare GitHub deployment](docs/deployment.md)

## License and attribution

MIT. Wot UI is the runtime dependency of preview and consumer projects. The website's source-owned shadcn-vue components retain upstream attribution in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). This is an independent community project, not an official shadcn or Wot product.

## Mobile Creator and component fixtures

`/create` follows the shadcn-vue Create workbench: compact dark controls, pickers,
per-setting shuffle locks, preset code import/copy, and an install dialog.
`/creator` remains an alias. Creator has a responsive card preview; individual
Blocks use a mobile-width preview. English is the default, with Chinese available at `/zh`.

- Ten accent presets, five neutral bases, four styles, light/dark palettes,
  heading/body font stacks, chart color, radius, density, and custom hex colors.
- An expanded multi-column creator, all 100 Wot components, and 28 editable application blocks.
- The catalog has source fixtures for all 100 `wd-*` components in Wot UI 2.3.2,
  grouped into Basics, Forms, Pickers, Navigation, Data, and Feedback. Structural
  components are exercised inside their parent examples.
- Upload is a disabled visual fixture. Media and image cropping use bundled local
  assets; no production upload, payment, account, or persistence service is called.
- `pnpm build:weixin` compiles the same fixture to `apps/preview/dist/build/mp-weixin`.
  Set your own AppID in the generated/imported development project to test on a device.

Source coverage and a successful WeChat compile are not a claim that every interaction
has passed on a real phone. Camera/file selection, canvas export, gestures, video playback,
font loading, and detached overlays should be checked on the intended WeChat devices.

Creator generates a portable preset code. Choose **Use this theme** and copy its install command:

```sh
pnpm dlx shadcn-uniapp@latest init --preset su1-820
```

Choose **Copy preset code** to copy just the code, then paste it into **Open preset** or use it with `init --preset`. Codes contain the complete theme and resolve locally without an account, database, or network request. Common Creator choices fit in a short code; custom names and colors add an encoded extension. `su1-820` is the default zinc theme. The CLI writes an editable theme JSON and SCSS into your project. Creator has no file-download workflow; the CLI retains `--theme <file>` for existing projects.

Font stacks are exported, not font files. The website bundles Manrope and JetBrains Mono
for preview; consumer projects must provide those fonts or use the system fallback.
Wot's solid primary/success/warning/danger buttons share `buttonMainColor`; the separate
`destructiveForeground` semantic token is for source-owned UI, not independent Wot solid
button text. Per-component hardcoded props can override inherited theme tokens.

### Languages

The website and live previews default to English, with Chinese available through the language control. Source-owned blocks default to English and accept an optional app-level translation function without another runtime dependency:

```ts
app.provide('shadcn-uniapp:translate', (message: string) => i18n.t(message))
```

### Icons and new miniapps

Install icons with `pnpm add @lucide/vue`. Add the Vite plugin once, before the existing `uni()` plugin. It supports Vite 5 and keeps normal named imports:

```ts
import { lucideUniapp } from 'shadcn-uniapp/vite'

// Keep the rest of your existing Vite configuration.
plugins: [lucideUniapp(), uni()]
```

Starting with 0.1.1, the plugin entry supports both ESM and CommonJS Vite configurations. Version 0.1.0 needs a dynamic import inside an async config callback for CommonJS projects; see [the compatibility notes](docs/lucide-uniapp.md#vite-5-commonjs-configuration).

```vue
<script setup lang="ts">
import { Search } from '@lucide/vue'
</script>

<template>
  <Search :size="24" color="currentColor" :stroke-width="2" />
</template>
```

H5 uses the official `@lucide/vue` components unchanged. During miniapp builds and watch mode, named icon imports are automatically converted to native `view` components with inline SVG masks. Only imported icons are cached in `src/shadcn-lucide/`; add `shadcn-lucide/` to `.gitignore`. No icon generation command, global icon registry, or copied source files need to be maintained. Aliases and type-only imports are supported. Use `size`, `color`, and `stroke-width` for portable sizing and color.

Theme exports contain no icon assets or global Wot icon replacements. Wot's private internal icons keep their library defaults. Arbitrary SVG DOM APIs, SVG children, filters, and SVG animation are outside this adapter's scope. WeChat compilation is checked; native rendering still needs real-device verification. GitHub keeps its brand logo because Lucide v1 does not contain brand icons. See [the rendering contract](docs/lucide-uniapp.md).

For a new uni-app miniapp, use **Tailwind CSS v4 + weapp-tailwindcss** with the [official uni-app Vite setup](https://tw.weapp.dev/zh-cn/docs/quick-start/frameworks/uni-app-vite). Preserve existing projects' styling system.

Existing UnoCSS projects are supported without a migration. The theme does not install or configure a utility framework. Docs includes **Set up with an AI agent**: choose existing styling, Tailwind v4, or UnoCSS, optionally enable Lucide, and copy project-aware installation instructions into your coding agent. The instructions install from npm, preserve existing versions and uncommitted files, and require H5 / miniapp verification.

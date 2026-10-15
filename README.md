# shadcn-uniapp

Shadcn-inspired themes, a visual theme creator, and editable source blocks for **Wot UI 2.x + uni-app**.

- Website: https://shadcn-uniapp.guygubaby.top
- Creator: https://shadcn-uniapp.guygubaby.top/create
- Source: https://github.com/guygubaby/shadcn-uniapp

Keep your `wd-*` components. Generate a theme instead of replacing the component library.

## What ships in v0.1.0

- Ten light/dark accent presets, including zinc, blue, emerald, rose, and orange.
- Validated theme JSON, semantic CSS variables and a Wot v2 token adapter.
- CLI commands: `init`, `generate`, `add`.
- Three source-owned blocks: `profile-card`, `settings-form`, `filter-list`.
- Vue SPA website using shadcn-vue, plus a real, separately compiled uni-app H5 preview.
- Creator with color/radius/density editing, contrast hints, JSON import/export, SCSS export and shareable URLs.

No Wot v1 adapter, dependency patching, Vite plugin, backend, account system or cloud theme storage is included. JSON imports are processed locally, not uploaded.

## Requirements

Consumer projects: Vue 3 + uni-app, npm-installed `@wot-ui/ui` **2.x** (verified against 2.3.2), existing Wot easycom and Sass configuration. CLI: Node.js 20.19+. This repository: Node.js 22.18+ (24.x recommended) and pnpm 10.32.1.

`uni_modules` installation and Wot v1 are not supported by this CLI. Do not upgrade your component library just to run it. H5 previews do not establish WeChat real-device compatibility.

## Use after npm publication

The npm package is prepared but is published manually by the maintainer. Until publication, use the local CLI described below.

```sh
pnpm add -D shadcn-uniapp sass
pnpm exec shadcn-uniapp init --preset zinc
pnpm exec shadcn-uniapp add profile-card
```

`init` creates:

```text
shadcn-uniapp.json
src/theme/shadcn.theme.json
src/theme/shadcn.scss
```

It appends a separate global SCSS block to `App.vue`, preserves existing scripts/styles, and adds the Wot theme entry only if it is not already present. An existing generated file aborts the operation before changes; `--force` is an explicit overwrite. No dependency is automatically installed.

```vue
<style lang="scss">
@use '@wot-ui/ui/styles/theme/index.scss' as *;
@use './theme/shadcn.scss' as *;
</style>
```

Use Creator to export JSON into the configured theme path, then run:

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

Source is copied to `src/components/blocks/<name>`. It relies on the consumer's existing Wot easycom configuration and uses no Tailwind/UnoCSS-specific layout utilities.

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

On the author's machine, use the configured Node binary:

```sh
export PATH="/Users/bryceloskie/Library/Caches/fnm_multishells/41098_1779758644280/bin:$PATH"
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` builds the package, Registry and uni-app H5 preview before starting the website. If editing preview or Registry sources, rebuild those artifacts or rerun `pnpm dev`.

```sh
pnpm check
pnpm pack:release
```

Try the unpublished CLI against an existing Wot v2 project:

```sh
node packages/shadcn-uniapp/dist/cli.js init --cwd /absolute/path/to/your-project
node packages/shadcn-uniapp/dist/cli.js add profile-card --cwd /absolute/path/to/your-project
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
per-setting shuffle locks, URL presets, JSON import, and an export/install dialog.
`/creator` remains an alias. The preview is a fixed 376px mobile canvas, not a desktop
component layout; all owned interface copy and the Wot locale are English.

- Ten accent presets, five neutral bases, four styles, light/dark palettes,
  heading/body font stacks, chart color, radius, density, and custom hex colors.
- Overview, component catalog, and the three editable business blocks.
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

Creator exports can initialize a project directly:

```sh
pnpm exec shadcn-uniapp init --theme ./shadcn.theme.json
```

Font stacks are exported, not font files. The website bundles Manrope and JetBrains Mono
for preview; consumer projects must provide those fonts or use the system fallback.
Wot's solid primary/success/warning/danger buttons share `buttonMainColor`; the separate
`destructiveForeground` semantic token is for source-owned UI, not independent Wot solid
button text. Per-component hardcoded props can override inherited theme tokens.

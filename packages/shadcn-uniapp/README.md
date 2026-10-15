# shadcn-uniapp

Shadcn-inspired themes and source-owned blocks for **Wot UI 2.x + uni-app**.

[Website](https://shadcn-uniapp.guygubaby.top) | [Creator](https://shadcn-uniapp.guygubaby.top/create) | [Documentation](https://shadcn-uniapp.guygubaby.top/docs) | [GitHub](https://github.com/guygubaby/shadcn-uniapp)

## Use

In an existing Vue 3 / uni-app project with npm-installed `@wot-ui/ui` 2.x, Wot easycom and Sass:

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

# Wot UI v2 implementation evidence

Checked 2026-10-15 against the actual published `@wot-ui/ui@2.3.2` tarball, not older `wot-design-uni` examples. [Registry metadata](https://registry.npmjs.org/@wot-ui%2fui/2.3.2), [published source tarball](https://registry.npmjs.org/@wot-ui/ui/-/ui-2.3.2.tgz). The matching upstream tag is `v2.3.2`, commit `4fbadc6fcca7e26d30b4aa565264e2bf56578196`.

## Decision

Build v1 as a theme adapter and source-owned blocks over Wot UI v2. Existing `wd-*` components remain in place. No dependency patch or replacement primitive library is needed for the verified theme hooks below. Supporting Wot UI v1 is a separate adapter, not an untested version-range promise.

## Exact theme contract

`ConfigProviderThemeVars` keys are camelCase; `mapThemeVarsToCSSVars` prefixes `--wot-`, converts capitals, and separates digits. Examples: `buttonPrimaryBg` becomes `--wot-button-primary-bg`; `primary6` becomes `--wot-primary-6`. [Converter source](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/composables/useConfigProvider.ts), [generated type inventory](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-config-provider/theme-vars.ts).

Useful verified camelCase keys (not an exhaustive inventory):

| Layer | Verified keys |
| --- | --- |
| Semantic palette | `primary1` through `primary10`; `dangerMain`, `dangerHover`, `dangerClicked`, `dangerDisabled`, `dangerParticular`, `dangerSurface`; corresponding `success*` and `warning*` keys |
| Neutrals | `textMain`, `textSecondary`, `textAuxiliary`, `textDisabled`, `textPlaceholder`, `textWhite`; corresponding `icon*` keys; `borderMain`, `borderStrong`, `borderLight`; `filledOppo`, `filledBottom`, `filledContent`, `filledStrong`, `filledZero` |
| Radius | `radiusSmall`, `radiusMain`, `radiusLarge`, `radiusExtraLarge`, `radiusSuperLarge`, `radiusUltraLarge`, `radiusFull` |
| Button | `buttonPrimaryBg`, `buttonPrimaryBgActive`, `buttonPrimaryColor`, `buttonPrimaryColorActive`, `buttonPrimaryPlainBg`, `buttonPrimaryPlainBgActive`, `buttonPrimaryPlainBorder`, `buttonPrimaryPlainBorderActive`, `buttonPrimarySoftBg`, `buttonPrimarySoftBgActive`; corresponding `success`, `warning`, `danger`, `info` families; `buttonMainColor`, `buttonRadiusMain`, `buttonRadiusFull`, `buttonHeightMedium` |
| Input | `inputBg`, `inputInnerColor`, `inputInnerPlaceholderColor`, `inputDisabledColor`, `inputIconColor`, `inputErrorColor`, `inputPadding`, `inputInnerHeight` |
| Cell / CellGroup | `cellBg`, `cellBgActive`, `cellTitleColor`, `cellLabelColor`, `cellValueColor`, `cellIconColor`, `cellArrowColor`, `cellBorderColor`, `cellThemeColor`, `cellTapBg`, `cellPlaceholderColor`; `cellGroupBg`, `cellGroupInsertRadius` |
| Popup / Overlay | `popupBg`, `popupCloseColor`, `popupCloseSize`, `popupRadius`; `overlayBg` |

Sources: [light semantic palette](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/styles/theme/light.scss), [dark palette](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/styles/theme/dark.scss), [radius](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/styles/theme/base/radius.scss), [Button SCSS](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-button/index.scss), [Input SCSS](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-input/index.scss), [Cell SCSS](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-cell/index.scss), [CellGroup SCSS](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-cell-group/index.scss), [Popup SCSS](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-popup/index.scss), [Overlay SCSS](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-overlay/index.scss).

Important distinctions:

- Filled primary Button foreground is `buttonMainColor`; `buttonPrimaryColor` controls plain/soft/text-family foregrounds. Setting only the latter does not change the filled Button text.
- `buttonPrimaryBgColor`, `buttonBorderRadius`, `cellBackground`, and `inputBorderColor` are not verified v2 component tokens. An outdated upstream docs snippet still uses `buttonPrimaryBgColor`; the published SCSS and generated types take precedence.
- Input v2 has no built-in label or border props/tokens. Put it inside `wd-form-item` or a labeled `wd-cell`; add source-owned wrapper styling where needed. It is not a drop-in shadcn desktop Input with every visual feature represented as a Wot token.

## Provider, dark mode, and detached overlays

`wd-config-provider` renders a `view` with `data-theme`, `wot-theme-light`/`wot-theme-dark`, and converted theme variables inline. It also shares global theme/Button/Tag config with descendants. Its SCSS applies the light/dark semantic mixins. The app should still import `@wot-ui/ui/styles/theme/index.scss` and explicitly set its own page background/text; the provider does not style the page itself. [Provider source](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-config-provider/wd-config-provider.vue), [provider docs](https://github.com/wot-ui/wot-ui/blob/v2.3.2/docs/component/config-provider.md), [theme entry](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/styles/theme/index.scss).

`wd-root-portal` uses H5 `Teleport` to `body` and WeChat `root-portal` after uni-app conditional compilation. It copies the injected hook/provider's `themeStyle` inline and its theme class to the detached root. Without injected configuration, it defaults to `wot-theme-light`. `wd-popup` only uses it when `root-portal` is true; the default is false. [Portal source](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-root-portal/wd-root-portal.vue), [Popup props](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-popup/types.ts).

Consequences for the adapter:

1. Generate concrete CSS values in `theme-vars`, and pass the complete selected light/dark map to the provider. A copied `var(--my-primary)` reference cannot resolve if `--my-primary` existed only on the original page ancestor.
2. A CSS-only static preset can cover pages and detached roots by applying component-variable declarations directly to global `:root`, `page`, and `.wd-root-portal`, loaded after Wot theme CSS. Merely putting variables on a page wrapper is insufficient for teleported content.
3. Do not promise cross-platform automatic dark propagation from page-local `.dark` CSS alone: detached roots default light and semantic variables can be redeclared closer to the component. Use the provider's explicit `theme` plus `theme-vars` for runtime switching.
4. `useConfigProvider` exists for miniapp injection/slot/portal limitations and is documented to work together with the component. Nested providers merge global config, but each provider's serialized `themeStyle` is built from its own input/hook, not the merged global bucket; provide a full map rather than relying on nested partial-map portal inheritance. [Hook docs](https://github.com/wot-ui/wot-ui/blob/v2.3.2/docs/component/use-config-provider.md), [global merge](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-config-provider/global-config.ts).

## Honest website preview

Do not directly register published Wot SFCs in an ordinary Vue SPA and call that a uni-app H5 preview. The source requires uni-app primitives, conditional compilation, and uni runtime APIs. For example, RootPortal includes platform-conditioned `renderjs`; Cell navigation calls `uni.navigateTo`; Popup safe-area handling calls uni system APIs; Input consumes uni event `detail`. A few components may appear to render under compatibility stubs, but this does not validate the supported platform. Sources: [Portal](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-root-portal/wd-root-portal.vue), [Cell](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-cell/wd-cell.vue), [Input](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-input/wd-input.vue), [runtime utilities](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/common/util.ts).

The smallest faithful preview is an isolated uni-app H5 app built with its compatible Vite 5 toolchain, copied into the Vue SPA's static output and embedded in an iframe. This preserves the website's Vite 8/Vue Router 5 stack. Wot itself uses this pattern: `build:docs` first builds H5 and `scripts/demoCopy.ts` copies `dist/build/h5` into the docs output's `/demo` directory. Its Vite config uses `base: './'`. [Build scripts](https://github.com/wot-ui/wot-ui/blob/v2.3.2/package.json), [copy script](https://github.com/wot-ui/wot-ui/blob/v2.3.2/scripts/demoCopy.ts), [Vite config](https://github.com/wot-ui/wot-ui/blob/v2.3.2/vite.config.ts).

Setup details: npm components use `"^wd-(.*)": "@wot-ui/ui/components/wd-$1/wd-$1.vue"` in easycom, or explicit SFC imports; the package root does not export all components. Wot requires Sass >1.78 and recommends `sass@^1.98.0`. [Quick start](https://github.com/wot-ui/wot-ui/blob/v2.3.2/docs/guide/quick-use.md), [package entry](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/index.ts).

For theme messaging, validate the expected `postMessage` origin and source window and allowlist the structured configuration. Label this as a real H5 preview, not WeChat runtime verification. A future WeChat build/device check remains necessary.

## Minimal v2 block recipes

These are API-confirmed structural recipes, not runtime-tested final blocks. They assume easycom and an enclosing configured theme provider. Layout/spacing should use the consumer's chosen atomic styling system.

```vue
<!-- profile-card -->
<wd-cell-group border>
  <wd-cell title="Bryce" label="Frontend engineer" value="Pro" />
  <wd-cell title="Workspace" value="Personal" />
</wd-cell-group>
<wd-button variant="plain" @click="emit('edit')">Edit profile</wd-button>

<!-- settings-form: settingsRef = ref({ email: '', notifications: true }) -->
<wd-form :model="settingsRef">
  <wd-form-item prop="email" title="Email">
    <wd-input v-model="settingsRef.email" placeholder="you@example.com" inputmode="email" />
  </wd-form-item>
  <wd-form-item prop="notifications" title="Notifications">
    <wd-switch v-model="settingsRef.notifications" />
  </wd-form-item>
</wd-form>
<wd-button @click="emit('save', { ...settingsRef })">Save changes</wd-button>

<!-- filter-list: queryRef = ref(''); filteredItems = computed(...) -->
<wd-input v-model="queryRef" placeholder="Filter items" clearable />
<wd-cell-group border>
  <wd-cell v-for="item in filteredItems" :key="item.id"
    :title="item.title" :label="item.description" clickable
    @click="emit('select', item.id)" />
</wd-cell-group>
<view v-if="filteredItems.length === 0">No matching items.</view>

<!-- detached-overlay smoke test -->
<wd-popup v-model="popupOpenRef" position="bottom" root-portal round closable>
  <wd-cell title="Theme propagation" value="Same palette as the page" />
</wd-popup>
```

Button v2 uses `type="primary|success|info|warning|danger"` and `variant="base|plain|dashed|soft|subtle|text"`, not the desktop shadcn variant names. Cell only emits `click` when `clickable` or `is-link` is enabled. FormItem uses `title` as the field title; `label` is secondary description. `wd-form` accepts a schema whose `validate(model)` returns `{ path: Array<string | number>, message: string }[]` (possibly async), with optional `isRequired(path)`; exposed `validate()` returns `{ valid, errors }`. Real persistence and boundary validation belong to the host app. Sources: [Button props](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-button/types.ts), [Cell props](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-cell/types.ts), [Form props](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-form/types.ts), [FormItem props](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-form-item/types.ts), [Switch props](https://github.com/wot-ui/wot-ui/blob/v2.3.2/src/uni_modules/wot-ui/components/wd-switch/types.ts).

## Verification boundary

Read published package source and matching official repository files only; no dependency installation, runtime mutation, browser automation, H5 build, or WeChat test was performed for this evidence note. Context7 lookup was unavailable because its monthly quota was exceeded; all material claims above use primary source instead.

# v0.1 verification

Verified on October 15, 2026. These are deliberately separate levels of evidence,
not a claim of exhaustive real-device support.

## Automated checks

- Initial GitHub commit `e374d46`: the Check workflow passed tests, type checks,
  package/website/H5 builds, WeChat compilation, and npm packaging.
- 22 tests cover the theme contract and token inventory, safe CLI source installation,
  all 100 pinned Wot component source fixtures, and English-only owned UI copy.
- The WeChat build contains JS, JSON, and WXML artifacts for all 100 `wd-*`
  components in `@wot-ui/ui@2.3.2`. Parent/child primitives are composed together.
- The WeChat entry opens the component catalog directly, with a light/dark switch,
  so a developer can reach the categories without editing the fixture source.

## Packed-package smoke test

Installed `artifacts/shadcn-uniapp-0.1.0.tgz` in a separate temporary consumer
with Wot UI 2.3.2 and Vue 3.4.21, rather than invoking the workspace CLI directly.
The installed binary passed:

1. `init --theme` using exported blue theme JSON.
2. `generate`, with the expected primary CSS variable in the result.
3. `add` for profile-card, settings-form, and filter-list.
4. Preservation of existing App.vue source and a single theme import.
5. Refusal to overwrite an installed block without `--force`.

## Browser evidence

The initial H5 smoke run exercised all six catalog categories, primary theme
changes, shuffle with a locked theme, dark mode, detached Popup theming,
and the export dialog. It reported no page errors. A subsequent source fix
corrected the CheckboxGroup fixture names exposed by its warnings.

The final Creator uses only a fixed mobile canvas. There is no desktop component
preview switch and no multi-column responsive component layout.

## Still required

- Production Cloudflare Pages deployment, custom-domain HTTPS, and live route/asset
  verification remain pending. A selected repository or target DNS name is not
  evidence that the website is deployed.
- Real-device WeChat and mobile-browser checks for gestures, media playback,
  canvas/signature/crop export, font loading, and portal positioning.
- Upload is intentionally disabled. No file-upload service is tested.
- The maintainer still needs to publish npm; this task does not run `publish`.

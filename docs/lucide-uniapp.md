# Lucide components for uni-app

The implementation stays inside shadcn-uniapp instead of publishing another package. `init` installs a project-local generator entry point. `shadcn-uniapp icons Search House` also works independently of `init`. Both use the consumer's installed `@lucide/vue`, generate only requested `.vue` files, and preserve existing files unless explicitly forced.

## Rendering contract

| Target                                 | Generated output                               | Color and sizing                                                   |
| -------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| H5 / ordinary App WebView              | Official `@lucide/vue` component               | `size`, `color`, `stroke-width`, `label`                           |
| Miniapp (`MP` conditional compilation) | A native `view` with `mask` and `-webkit-mask` | Same props; mask uses `background-color`, including `currentColor` |

The miniapp branch encodes a single icon's SVG shape in its own component. Theme CSS contains no icon data. The H5 branch strips the mask data; the miniapp branch strips the Lucide Vue runtime import and SVG element. This is a component adapter, not a global patch of Vue, Wot, or the installed Lucide package.

Import generated components from the project, for example `@/components/lucide/Search.vue`. Imports from `@lucide/vue` remain ordinary SVG components and are not rewritten. No component registry containing every Lucide icon is generated. Aliases such as `Home` resolve through Lucide's installed ESM exports.

The generator validates names against those exports, validates icon metadata, copies the original license, rejects path traversal and symlink outputs, and preflights conflicts before writing. Its data reader targets Lucide v1's `dist/esm/icons/*.mjs` metadata. If Lucide changes that layout, update the generator; it must not silently emit blank icons. Re-run generation with the CLI's `--force` after upgrading Lucide to refresh miniapp shapes.

## Limits and verification

This adapter covers static monochrome icons. It does not emulate SVG DOM access, arbitrary SVG children or attributes, filters, animations, absolute/non-scaling strokes, App nvue, or uni-app x. Wot's private icons without custom slots retain Wot's renderer.

Automated checks cover generated aliases and source branches, safe incremental writes, conflicts, and symlinks. H5 rendering and WeChat compilation are checked separately. A successful build does not verify every miniapp engine: test the generated mask and `currentColor` on the intended iOS/Android devices before claiming full platform support.

References: [Lucide Vue imports render inline SVG and support tree shaking](https://lucide.dev/guide/vue/getting-started), [DCloud's SVG platform limits](https://uniapp.dcloud.net.cn/component/image#图片格式说明).

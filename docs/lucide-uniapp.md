# Lucide Vite plugin for uni-app

Register the plugin before `uni()` in the existing Vite configuration:

```ts
import { lucideUniapp } from 'shadcn-uniapp/vite'

// Keep your other plugins and settings.
plugins: [lucideUniapp(), uni()]
```

Use normal named imports everywhere:

```vue
<script setup lang="ts">
import { Search, House as Home } from '@lucide/vue'
</script>

<template>
  <Search :size="24" color="currentColor" :stroke-width="2" />
  <Home :size="24" />
</template>
```

## Rendering and build contract

| Target                        | Behavior                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| H5 / ordinary App WebView     | Imports stay unchanged; official Lucide SVG components and tree shaking                           |
| Miniapp (`UNI_PLATFORM=mp-*`) | Named imports in Vue SFCs and JS/TS modules become native `view` components with inline SVG masks |

The plugin uses Vite 5's `configResolved`, `buildStart`, and `transform` hooks with `enforce: 'pre'`. It does not require newer hook filters, environment APIs, or a framework upgrade. Its SFC parser comes from the project's own `vue/compiler-sfc` to respect uni-app's Vue compiler aliases and pinned version.

Only imported icons are written to `UNI_INPUT_DIR/shadcn-lucide/` (normally `src/shadcn-lucide/`), with the original license. This filesystem cache lets uni-app discover and compile native components. Add `shadcn-lucide/` to `.gitignore`. Cache components are not globally registered, so unused files do not become application dependencies. Source imports are transformed in memory, with source maps; user source and installed dependencies are not patched. No icon generation command is needed.

The whole installed Lucide v1 catalog is available by named import, including aliases. Hashes in cache filenames avoid collisions between aliases differing only by case. Type-only imports stay type-only. New imports are handled during normal build/watch transformation, and unchanged cache files are not rewritten. The plugin validates names and icon metadata and fails if the installed Lucide metadata layout changes.

## Supported API and limits

Use `size`, `color`, and `stroke-width` for cross-platform styling; the native mask inherits `currentColor`. The miniapp adapter covers static monochrome icons, not SVG DOM access, arbitrary SVG children, filters, SVG animation, or absolute/non-scaling strokes. Namespace/default imports and non-icon helper exports are not adapted; use named icon imports. App nvue and uni-app x are outside this plugin's scope. Wot's private icons keep their renderer.

H5 and WeChat builds use the repository's existing uni-app + Vite 5.2.8 fixture. Compiler output is checked for native `view` components and removal of the Lucide SVG runtime on WeChat. A successful build does not verify every miniapp engine: test masks and colors on intended iOS/Android devices before claiming full platform support.

References: [Vite 5 plugin hooks](https://v5.vite.dev/guide/api-plugin), [Lucide Vue named imports](https://lucide.dev/guide/vue/getting-started), [DCloud SVG limits](https://uniapp.dcloud.net.cn/component/image#图片格式说明).

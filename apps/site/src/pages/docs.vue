<script setup lang="ts">
import { Button } from '@/components/ui/button'
import CodeBlock from '@/components/CodeBlock.vue'
const install = 'pnpm add -D shadcn-uniapp sass\npnpm exec shadcn-uniapp init --preset zinc'
const local =
  'pnpm install\npnpm --filter shadcn-uniapp build\nnode /path/to/shadcn-uniapp/packages/shadcn-uniapp/dist/cli.js init --cwd /path/to/your-project'
const app = `<style lang="scss">\n@use '@wot-ui/ui/styles/theme/index.scss' as *;\n@use './theme/shadcn.scss' as *;\n</style>`
const block = `<script setup lang="ts">\nimport ProfileCard from '@/components/blocks/profile-card/ProfileCard.vue'\n<\/script>\n\n<template>\n  <ProfileCard\n    name="Bryce"\n    description="Design & Development"\n    @edit="openEditPage"\n  />\n</template>`
</script>

<template>
  <div class="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
    <nav
      aria-label="On this page"
      class="flex flex-wrap items-start gap-5 text-sm lg:sticky lg:top-25 lg:flex-col lg:self-start"
    >
      <a href="#requirements">Requirements</a><a href="#install">Installation</a
      ><a href="#theme">Create a theme</a><a href="#blocks">Add blocks</a
      ><a href="#runtime">Runtime themes</a><a href="#limits">Scope</a>
    </nav>
    <article class="max-w-3xl min-w-0">
      <h1 class="text-3xl font-semibold tracking-tight">Add a theme. Keep your components.</h1>
      <p class="mt-4 text-base leading-8 text-muted-foreground">
        Keep your Wot components and business logic. Start with a theme, then add blocks when you
        need them.
      </p>
      <section id="requirements" class="scroll-mt-25 py-9">
        <h2 class="text-xl font-semibold">Requirements</h2>
        <ul class="mt-4 grid gap-3 text-sm leading-7 text-muted-foreground">
          <li>
            An existing Vue 3 + uni-app project with npm-installed @wot-ui/ui 2.x. Tested with
            2.3.2.
          </li>
          <li>
            Keep your Wot easycom, Sass, and build setup. No need to switch Tailwind or UnoCSS.
          </li>
          <li>
            The CLI requires Node.js 20.19+. This repository requires Node.js 22.18+; 24.x is
            recommended.
          </li>
          <li>Wot v1 and uni_modules installations are not supported by this CLI.</li>
        </ul>
      </section>
      <section id="install" class="scroll-mt-25 border-t py-9">
        <h2 class="text-xl font-semibold">Install and initialize</h2>
        <p class="my-4 text-sm leading-7 text-muted-foreground">
          After the npm release, run these commands. The init command creates your config and theme
          JSON / SCSS, then appends the theme imports to App.vue. It does not install dependencies
          or patch Wot.
        </p>
        <CodeBlock :code="install" />
        <p class="my-4 text-sm leading-7 text-muted-foreground">
          The maintainer publishes to npm manually. Until then, clone the repository and use the
          local CLI:
        </p>
        <CodeBlock :code="local" />
        <p class="my-4 text-sm leading-7 text-muted-foreground">
          The initializer adds these imports to App.vue. An existing Wot theme import is not added
          again.
        </p>
        <CodeBlock :code="app" label="src/App.vue (excerpt)" />
      </section>
      <section id="theme" class="scroll-mt-25 border-t py-9">
        <h2 class="text-xl font-semibold">Create and update themes</h2>
        <ol
          class="my-4 flex list-inside list-decimal flex-col gap-3 text-sm leading-7 text-muted-foreground"
        >
          <li>
            Open Creator. Adjust light and dark colors, radius, and density. Check contrast and the
            live preview.
          </li>
          <li>Export JSON to the theme path in shadcn-uniapp.json.</li>
          <li>Run generate to update the configured stylesheet.</li>
          <li>Check existing hardcoded colors, explicit color props, and deep style overrides.</li>
        </ol>
        <CodeBlock code="pnpm exec shadcn-uniapp generate" />
        <div class="mt-4">
          <Button as-child variant="outline"
            ><RouterLink to="/create">Open Creator</RouterLink></Button
          >
        </div>
      </section>
      <section id="blocks" class="scroll-mt-25 border-t py-9">
        <h2 class="text-xl font-semibold">Add source-owned blocks</h2>
        <p class="my-4 text-sm leading-7 text-muted-foreground">
          Run init before adding a block. Existing files are protected unless you explicitly pass
          --force. Your application handles business events.
        </p>
        <CodeBlock code="pnpm exec shadcn-uniapp add profile-card" />
        <div class="mt-4">
          <CodeBlock
            :code="block"
            label="Usage: replace openEditPage with your navigation handler"
          />
        </div>
      </section>
      <section id="runtime" class="scroll-mt-25 border-t py-9">
        <h2 class="text-xl font-semibold">Runtime themes and overlays</h2>
        <p class="my-4 text-sm leading-7 text-muted-foreground">
          Static SCSS applies a global theme. For dynamic or scoped themes, install the package as a
          runtime dependency. Pass getWotThemeVars(config, mode) to wd-config-provider as
          theme-vars, and set theme to light or dark. Concrete color values keep detached RootPortal
          overlays in sync. Apply your page background and text colors separately.
        </p>
        <CodeBlock
          code="import { getWotThemeVars } from 'shadcn-uniapp'\n\nconst vars = getWotThemeVars(config, 'dark')"
          label="Validate config with parseTheme first"
        />
      </section>
      <section id="limits" class="scroll-mt-25 border-t py-9">
        <h2 class="text-xl font-semibold">Release scope</h2>
        <p class="mt-4 text-sm leading-8 text-muted-foreground">
          Themes target Wot UI 2.x. Blocks are uni-app Vue source. The website preview is a real H5
          build, not simulated Reka components. WeChat compilation does not replace real-device
          testing. Wot v1, native apps, arbitrary desktop shadcn-vue components, backends,
          authentication, uploads, and Vite patches are outside this release.
        </p>
      </section>
    </article>
  </div>
</template>

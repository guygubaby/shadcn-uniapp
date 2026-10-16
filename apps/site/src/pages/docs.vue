<script setup lang="ts">
import { useI18n } from '@/lib/i18n'
import { computed } from 'vue'
import { useBrowserLocation } from '@vueuse/core'

import RevealText from '@/components/motion/RevealText.vue'
import RevealBlock from '@/components/motion/RevealBlock.vue'
import { Button } from '@/components/ui/button'
import CodeBlock from '@/components/CodeBlock.vue'

const { t } = useI18n()
const locationRef = useBrowserLocation()
const sections = [
  { id: 'requirements', label: 'Requirements' },
  { id: 'install', label: 'Installation' },
  { id: 'theme', label: 'Create a theme' },
  { id: 'blocks', label: 'Add blocks' },
  { id: 'runtime', label: 'Runtime themes' },
  { id: 'limits', label: 'Scope' },
]
const activeSection = computed(
  () =>
    sections.find((section) => `#${section.id}` === locationRef.value.hash)?.id ?? 'requirements',
)
const install =
  'pnpm add -D shadcn-uniapp sass\npnpm add @lucide/vue\npnpm exec shadcn-uniapp init --preset zinc'
const local =
  'pnpm install\npnpm --filter shadcn-uniapp build\nnode /path/to/shadcn-uniapp/packages/shadcn-uniapp/dist/cli.js init --cwd /path/to/your-project'
const app = `<style lang="scss">\n@use '@wot-ui/ui/styles/theme/index.scss' as *;\n@use './theme/shadcn.scss' as *;\n</style>`
const block = `<script setup lang="ts">\nimport ProfileCard from '@/components/blocks/profile-card/ProfileCard.vue'\n<\/script>\n\n<template>\n  <ProfileCard\n    name="Bryce"\n    description="Design & Development"\n    @edit="openEditPage"\n  />\n</template>`
const runtime = `import { getWotThemeVars } from 'shadcn-uniapp'

const vars = getWotThemeVars(config, 'dark')`
</script>

<template>
  <div class="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
    <nav
      :aria-label="t('On this page')"
      class="docs-nav flex flex-wrap gap-2 text-sm lg:sticky lg:top-25 lg:flex-col lg:self-start"
    >
      <Button
        v-for="section in sections"
        :key="section.id"
        as-child
        variant="navigation"
        class="justify-start lg:w-full"
        :data-active="activeSection === section.id"
        :aria-current="activeSection === section.id ? 'location' : undefined"
      >
        <a :href="`#${section.id}`">{{ t(section.label) }}</a>
      </Button>
    </nav>
    <article class="max-w-3xl min-w-0">
      <h1 class="text-3xl font-semibold tracking-tight">
        <RevealText :text="t('Add a theme. Keep your components.')" />
      </h1>
      <p class="mt-4 text-base leading-8 text-muted-foreground">
        <RevealText
          :text="
            t(
              'Keep your Wot components and business logic. Start with a theme, then add blocks when you need them.',
            )
          "
          :delay="0.1"
        />
      </p>
      <RevealBlock
        ><section id="requirements" class="scroll-mt-25 py-9">
          <h2 class="text-xl font-semibold">{{ t('Requirements') }}</h2>
          <ul class="mt-4 grid gap-3 text-sm leading-7 text-muted-foreground">
            <li>
              {{
                t(
                  'An existing Vue 3 + uni-app project with npm-installed @wot-ui/ui 2.x. Tested with 2.3.2.',
                )
              }}
            </li>
            <li>
              {{
                t(
                  'Keep your Wot easycom and Sass setup. Install @lucide/vue for icons. New miniapps should use Tailwind CSS v4 with weapp-tailwindcss.',
                )
              }}
            </li>
            <li>
              {{
                t(
                  'The CLI requires Node.js 20.19+. This repository requires Node.js 22.18+; 24.x is recommended.',
                )
              }}
            </li>
            <li>{{ t('Wot v1 and uni_modules installations are not supported by this CLI.') }}</li>
          </ul>
        </section></RevealBlock
      >
      <RevealBlock
        ><section id="install" class="scroll-mt-25 border-t py-9">
          <h2 class="text-xl font-semibold">{{ t('Install and initialize') }}</h2>
          <p class="my-4 text-sm leading-7 text-muted-foreground">
            {{
              t(
                'After the npm release, run these commands. The init command creates your config and theme JSON / SCSS, then appends the theme imports to App.vue. It does not install dependencies or patch Wot.',
              )
            }}
          </p>
          <CodeBlock :code="install" />
          <p class="my-4 text-sm leading-7 text-muted-foreground">
            {{
              t(
                'The maintainer publishes to npm manually. Until then, clone the repository and use the local CLI:',
              )
            }}
          </p>
          <CodeBlock :code="local" />
          <p class="my-4 text-sm leading-7 text-muted-foreground">
            {{
              t(
                'The initializer adds these imports to App.vue. An existing Wot theme import is not added again.',
              )
            }}
          </p>
          <CodeBlock :code="app" :label="t('src/App.vue (excerpt)')" /></section
      ></RevealBlock>
      <RevealBlock
        ><section id="theme" class="scroll-mt-25 border-t py-9">
          <h2 class="text-xl font-semibold">{{ t('Create and update themes') }}</h2>
          <ol
            class="my-4 flex list-inside list-decimal flex-col gap-3 text-sm leading-7 text-muted-foreground"
          >
            <li>
              {{
                t(
                  'Open Creator. Adjust light and dark colors, radius, and density. Check contrast and the live preview.',
                )
              }}
            </li>
            <li>{{ t('Export JSON to the theme path in shadcn-uniapp.json.') }}</li>
            <li>{{ t('Run generate to update the configured stylesheet.') }}</li>
            <li>
              {{
                t(
                  'Check existing hardcoded colors, explicit color props, and deep style overrides.',
                )
              }}
            </li>
          </ol>
          <CodeBlock code="pnpm exec shadcn-uniapp generate" />
          <div class="mt-4">
            <Button as-child variant="outline"
              ><RouterLink to="/create">{{ t('Open Creator') }}</RouterLink></Button
            >
          </div>
        </section></RevealBlock
      >
      <RevealBlock
        ><section id="blocks" class="scroll-mt-25 border-t py-9">
          <h2 class="text-xl font-semibold">{{ t('Add source-owned blocks') }}</h2>
          <p class="my-4 text-sm leading-7 text-muted-foreground">
            {{
              t(
                'Run init before adding a block. Existing files are protected unless you explicitly pass --force. Your application handles business events.',
              )
            }}
          </p>
          <CodeBlock code="pnpm exec shadcn-uniapp add profile-card" />
          <div class="mt-4">
            <CodeBlock
              :code="block"
              :label="t('Usage: replace openEditPage with your navigation handler')"
            />
          </div></section
      ></RevealBlock>
      <RevealBlock
        ><section id="runtime" class="scroll-mt-25 border-t py-9">
          <h2 class="text-xl font-semibold">{{ t('Runtime themes and overlays') }}</h2>
          <p class="my-4 text-sm leading-7 text-muted-foreground">
            {{
              t(
                'Static SCSS applies a global theme. For dynamic or scoped themes, install the package as a runtime dependency. Pass getWotThemeVars(config, mode) to wd-config-provider as theme-vars, and set theme to light or dark. Concrete color values keep detached RootPortal overlays in sync. Apply your page background and text colors separately.',
              )
            }}
          </p>
          <CodeBlock :code="runtime" :label="t('Validate config with parseTheme first')" /></section
      ></RevealBlock>
      <RevealBlock
        ><section id="limits" class="scroll-mt-25 border-t py-9">
          <h2 class="text-xl font-semibold">{{ t('Release scope') }}</h2>
          <p class="mt-4 text-sm leading-8 text-muted-foreground">
            {{
              t(
                'Themes target Wot UI 2.x. Blocks are uni-app Vue source. The website preview is a real H5 build, not simulated Reka components. WeChat compilation does not replace real-device testing. Wot v1, native apps, arbitrary desktop shadcn-vue components, backends, authentication, uploads, and Vite patches are outside this release.',
              )
            }}
          </p>
        </section></RevealBlock
      >
    </article>
  </div>
</template>

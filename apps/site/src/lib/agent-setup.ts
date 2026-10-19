import type { UiLocale } from 'shadcn-uniapp'

export type SetupStyling = 'preserve' | 'tailwind' | 'unocss'

export function createAgentSetupPrompt(
  options: { styling: SetupStyling; lucide: boolean },
  locale: UiLocale,
) {
  const say = (zh: string, en: string) => (locale === 'zh-CN' ? zh : en)
  const styling = {
    preserve: say(
      '保留现有样式方案与版本。检查 UnoCSS / Tailwind 配置及锁文件，已有 UnoCSS 不迁移。如果尚未使用原子 CSS，先让我选择；推荐新项目使用 Tailwind CSS v4 + weapp-tailwindcss。',
      'Preserve the existing styling system and versions. Inspect UnoCSS / Tailwind config and the lockfile; keep existing UnoCSS. If neither is present, ask me to choose first; recommend Tailwind CSS v4 + weapp-tailwindcss for new projects.',
    ),
    tailwind: say(
      '选择 Tailwind CSS v4 + weapp-tailwindcss。已有相同方案则复用；若已有另一套样式系统，先确认迁移再更改。未配置时 pnpm add -D tailwindcss@4 weapp-tailwindcss；建立纯 CSS 入口并实际全局导入；uni() 后注册 WeappTailwindcss，cssEntries 使用绝对路径，按小程序目标配置 rem2rpx；不要再注册 @tailwindcss/vite 或另一套 PostCSS 生成插件。保留 Wot 基础样式，避免重置样式破坏组件。',
      'Choose Tailwind CSS v4 + weapp-tailwindcss. Reuse it if present; confirm a migration before replacing a different styling system. Otherwise install with pnpm add -D tailwindcss@4 weapp-tailwindcss. Create and globally import a plain CSS entry; register WeappTailwindcss after uni(), use absolute cssEntries and rem2rpx for the miniapp target. Do not also register @tailwindcss/vite or another PostCSS generator. Preserve Wot base styles and avoid conflicting resets.',
    ),
    unocss: say(
      '选择 UnoCSS。已有 UnoCSS 时保留版本、presets、shortcuts、图标规则与单位约定；不安装 Tailwind / weapp-tailwindcss。尚未配置时优先遵守项目 AGENTS.md 的版本约束（本项目约定 unocss@0.58.9），搭配兼容的 @uni-helper/unocss-preset-uni。检查对应版本官方文档，配置 UnoCSS Vite 插件、presetUni、源码扫描和实际全局 CSS 导入，并验证 H5 与微信单位转换。',
      'Choose UnoCSS. Preserve existing versions, presets, shortcuts, icon rules and units; do not install Tailwind / weapp-tailwindcss. For a new setup follow the project AGENTS.md version constraints (this project uses unocss@0.58.9) and a compatible @uni-helper/unocss-preset-uni. Check the version-specific official docs, configure the UnoCSS Vite plugin, presetUni, source scanning and a real global CSS import; verify H5 and WeChat unit conversion.',
    ),
  }
  return [
    say(
      '请直接在当前目标项目中安装并初始化 shadcn-uniapp，按下面的选择实施并验证。',
      'Install and initialize shadcn-uniapp in the current target project using the choices below, then verify the result.',
    ),
    say(
      '1. 先读取 AGENTS.md、package.json、锁文件、App.vue、Vite / UnoCSS / Tailwind / Wot 配置及 git 状态。保持现有 Vue 3 + uni-app 与 Vite 5，不覆盖未提交修改，不新建另一套项目。若 Wot 为 v1 或 uni_modules 安装，先说明不兼容并询问迁移；不要强行升级。',
      '1. Read AGENTS.md, package.json, the lockfile, App.vue, Vite / UnoCSS / Tailwind / Wot config and git status. Keep existing Vue 3 + uni-app and Vite 5; preserve uncommitted changes and do not scaffold another project. If Wot is v1 or installed through uni_modules, explain the incompatibility and ask about migration instead of forcing an upgrade.',
    ),
    `2. ${styling[options.styling]}`,
    say(
      '3. 使用 pnpm，从 npm 安装：pnpm add -D shadcn-uniapp sass。静态主题用 devDependency；若应用使用运行时 getWotThemeVars，则将 shadcn-uniapp 作为运行时依赖。',
      '3. Use pnpm to install from npm: pnpm add -D shadcn-uniapp sass. Use a dev dependency for static themes and a runtime dependency when the application uses getWotThemeVars.',
    ),
    options.lucide
      ? say(
          '4. 使用 Lucide：pnpm add @lucide/vue。Vite 配置中从 shadcn-uniapp/vite 导入 lucideUniapp，并放在 uni() 前面；不要更换 Vite 5。业务仍用 import { Search } from "@lucide/vue"，由插件自动兼容小程序。将 shadcn-lucide/ 加入 .gitignore；无需生成命令，也不导出整套图标 CSS。',
          '4. Enable Lucide: pnpm add @lucide/vue. Import lucideUniapp from shadcn-uniapp/vite and register it before uni(); keep Vite 5. Keep normal imports such as import { Search } from "@lucide/vue"; the plugin adapts miniapp rendering automatically. Ignore shadcn-lucide/ in Git. No generation command or full icon CSS export is needed.',
        )
      : say(
          '4. 不启用 Lucide：保留项目现有图标方案，不安装 @lucide/vue，不注册 lucideUniapp。若后续添加的 Block 引用了 Lucide，先适配为现有图标组件或让我确认启用，不能留下缺失依赖。',
          '4. Disable Lucide: preserve existing icons; do not install @lucide/vue or register lucideUniapp. If a selected block imports Lucide, adapt it to existing icons or ask me to enable Lucide; do not leave missing dependencies.',
        ),
    say(
      '5. 若尚未初始化，运行 pnpm exec shadcn-uniapp init --preset zinc。已有 shadcn-uniapp.json 时保留其主题与路径，使用 generate；不要未经确认使用 --force。保留 Wot easycom 和 Sass 设置，确保全局主题在 Wot 样式之后引入。主题本身可配合 Tailwind 或 UnoCSS。',
      '5. If not initialized, run pnpm exec shadcn-uniapp init --preset zinc. If shadcn-uniapp.json exists, preserve its theme and paths and use generate; never pass --force without confirming replacement. Keep Wot easycom and Sass and import the global theme after Wot styles. The theme works with either Tailwind or UnoCSS.',
    ),
    say(
      '6. init 会自动保存 UI_STYLE_GUIDE.md 并在 AGENTS.md 中引用；旧项目运行 generate 补齐缺失的指南与引用。读取这份指南，后续页面复用当前主题和共享组件。保留用户已有的指南内容及项目规则；其他 Agent 若使用不同规则文件，在其现有规则文件中引用同一份指南。',
      '6. init automatically saves UI_STYLE_GUIDE.md and references it from AGENTS.md; generate adds missing guidance to older projects. Read that guide and reuse the current theme and shared components for future pages. Preserve customized guides and project rules. If another agent uses a different project rules file, reference the same guide there.',
    ),
    say(
      '7. 使用目标项目现有命令完成类型检查、H5 与微信小程序构建，实际检查主题切换、表单间距及所选图标渲染。报告更改文件、采用的样式方案、通过的检查与未完成的真机验证。不要把编译通过说成真机验证通过。',
      '7. Use the target project commands for type checks, H5 and WeChat builds. Check theme switching, form spacing and selected icons. Report changed files, chosen styling, passed checks and remaining real-device verification; compilation is not real-device testing.',
    ),
    'References: https://shadcn-uniapp.guygubaby.top/docs | https://tw.weapp.dev/zh-cn/docs/quick-start/frameworks/uni-app-vite | https://uni-helper.js.org/unocss-preset-uni/',
  ].join('\n\n')
}

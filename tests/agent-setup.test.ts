import { expect, it } from 'vitest'
import { createAgentSetupPrompt } from '../apps/site/src/lib/agent-setup'

it('keeps legacy UnoCSS and project changes by default, with optional Lucide integration', () => {
  const prompt = createAgentSetupPrompt({ styling: 'preserve', lucide: true }, 'en-US')
  expect(prompt).toContain('keep existing UnoCSS')
  expect(prompt).toContain('preserve uncommitted changes')
  expect(prompt).toContain('lucideUniapp')
  expect(prompt).toContain('before uni()')
  expect(prompt).toContain('If unpublished, build and pack')
})

it('separates UnoCSS and Tailwind choices, and skips Lucide installation when disabled', () => {
  const uno = createAgentSetupPrompt({ styling: 'unocss', lucide: false }, 'zh-CN')
  expect(uno).toContain('不安装 Tailwind / weapp-tailwindcss')
  expect(uno).toContain('不安装 @lucide/vue，不注册 lucideUniapp')
  expect(uno).not.toContain('pnpm add @lucide/vue')
  expect(uno).toContain('unocss@0.58.9')
  const tailwind = createAgentSetupPrompt({ styling: 'tailwind', lucide: false }, 'en-US')
  expect(tailwind).toContain('absolute cssEntries')
  expect(tailwind).toContain('confirm a migration')
  expect(tailwind).toContain('Do not also register @tailwindcss/vite')
})

import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
import { afterEach, expect, it, vi } from 'vitest'
import type { Component, Ref, SetupContext } from '../apps/preview/node_modules/vue'
import { blocks } from '../packages/shadcn-uniapp/src/blocks'
import { chineseMessages } from '../packages/shadcn-uniapp/src/i18n'
import { removePreviewI18n } from '../scripts/block-source.mjs'

const previewRequire = createRequire(new URL('../apps/preview/package.json', import.meta.url))
const { parse, compileScript } = previewRequire('vue/compiler-sfc')
const { createRenderer } = previewRequire(
  'vue',
) as typeof import('../apps/preview/node_modules/vue')
const cleanup: (() => void)[] = []

function mountBlock<T>(name: string, props: Record<string, unknown> = {}) {
  const block = blocks.find((item) => item.name === name)!
  const filename = `packages/shadcn-uniapp/registry/${name}/${block.files[0]}`
  const source = removePreviewI18n(readFileSync(filename, 'utf8'))
  const script = compileScript(parse(source, { filename }).descriptor, { id: name })
  const code = ts.transpileModule(script.content, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const result = {
    exports: {} as {
      default: { setup: (props: Record<string, unknown>, context: SetupContext) => T }
    },
  }
  new Function('require', 'module', 'exports', code)(previewRequire, result, result.exports)
  const component = result.exports.default
  const setup = component.setup
  let state!: T
  const emit = vi.fn()
  component.setup = (resolvedProps, context) => {
    state = setup(resolvedProps, { ...context, emit })
    return (() => null) as T
  }
  const renderer = createRenderer({
    createElement: () => ({}),
    createText: () => ({}),
    createComment: () => ({}),
    insert() {},
    remove() {},
    patchProp() {},
    setText() {},
    setElementText() {},
    parentNode: () => null,
    nextSibling: () => null,
  })
  const app = renderer.createApp(component as unknown as Component, props)
  app.mount({})
  cleanup.push(() => app.unmount())
  return { state, emit }
}

afterEach(() => {
  cleanup.splice(0).forEach((unmount) => unmount())
  vi.useRealTimers()
})

type FormState = {
  schema: { validate: (model: Record<string, unknown>) => { path: string[] }[] }
  model: Ref<Record<string, unknown>>
  formRef: Ref<{ validate: () => Promise<{ valid: boolean }> }>
  submit: () => Promise<void>
}

it('defaults to WeChat and validates only the active sign-in method plus consent', async () => {
  const { state, emit } = mountBlock<
    FormState & {
      modeRef: Ref<'wechat' | 'password'>
      emailRef: Ref<string>
      passwordRef: Ref<string>
      agreedRef: Ref<boolean>
    }
  >('login-form')
  expect(state.modeRef.value).toBe('wechat')
  expect(state.schema.validate(state.model.value).map((issue) => issue.path[0])).toEqual(['agreed'])
  state.formRef.value = {
    validate: async () => ({ valid: state.schema.validate(state.model.value).length === 0 }),
  }
  await state.submit()
  expect(emit).not.toHaveBeenCalled()
  state.agreedRef.value = true
  await state.submit()
  expect(emit).toHaveBeenCalledWith('wechat')
  state.modeRef.value = 'password'
  await state.submit()
  expect(emit).toHaveBeenCalledTimes(1)
  state.emailRef.value = ' parent@example.com '
  state.passwordRef.value = ' a long password '
  await state.submit()
  expect(emit).toHaveBeenLastCalledWith('submit', {
    email: 'parent@example.com',
    password: ' a long password ',
  })
})

it('retains leading zeroes in verification codes and expires a resend cooldown', () => {
  vi.useFakeTimers()
  const { state } = mountBlock<{ schema: FormState['schema']; remainingRef: Ref<number> }>(
    'verify-code',
    { destination: '+86 138 **** 2048', resendAt: Date.now() + 2000 },
  )
  expect(state.schema.validate({ code: '012345' })).toEqual([])
  expect(state.schema.validate({ code: '12345' })).toHaveLength(1)
  expect(state.remainingRef.value).toBe(2)
  vi.advanceTimersByTime(3000)
  expect(state.remainingRef.value).toBe(0)
})

it('caps a checkout coupon at the item subtotal and preserves shipping', () => {
  const { state } = mountBlock<{ couponRef: Ref<boolean>; totalCents: Ref<number> }>(
    'checkout-order',
    {
      items: [{ id: 'one', name: 'Book', variant: 'A5', quantity: 3, priceCents: 1999 }],
      address: { name: 'Alex', phone: '123', detail: 'Shanghai' },
      shippingCents: 500,
      discountCents: 10000,
    },
  )
  expect(state.totalCents.value).toBe(6497)
  state.couponRef.value = true
  expect(state.totalCents.value).toBe(500)
})

it('rejects unavailable campus visits and reversed absence dates', () => {
  const { state: visit } = mountBlock<FormState>('campus-visit', {
    school: 'School',
    sessions: [{ id: 'full', campus: 'North', date: 'Oct 24', time: '09:30', available: false }],
  })
  expect(
    visit.schema.validate({ parentName: 'Alex', email: 'alex@example.com', session: 'full' }),
  ).toEqual([{ path: ['session'], message: 'Choose an available visit' }])
  const { state: absence } = mountBlock<FormState>('absence-request', {
    students: [{ id: 'a', name: 'Alex', grade: 'Grade 5', initials: 'AT' }],
    minDate: 1000,
    maxDate: 5000,
  })
  expect(
    absence.schema.validate({ student: 'a', range: [4000, 2000], reason: 'Medical appointment' }),
  ).toHaveLength(1)
  expect(
    absence.schema.validate({ student: 'a', range: [2000, 2000], reason: 'Medical appointment' }),
  ).toEqual([])
  expect(absence.schema.validate({ student: 'a', range: [2000, 6000], reason: '' })).toHaveLength(2)
})

it('provides Chinese labels for every new mobile and school block', () => {
  const mobile = blocks.filter((block) => 'category' in block)
  expect(mobile).toHaveLength(9)
  expect(new Set(blocks.map((block) => block.name)).size).toBe(blocks.length)
  for (const block of mobile) {
    const source = readFileSync(
      `packages/shadcn-uniapp/registry/${block.name}/${block.files[0]}`,
      'utf8',
    )
    for (const match of source.matchAll(/\bt\('([^']+)'\)/g)) {
      if (match[1]!.includes('@')) continue
      expect(chineseMessages[match[1]!], `${block.name}: ${match[1]}`).toBeTruthy()
    }
  }
})

it('marks remaining students without overwriting absences and blocks incomplete roll calls', () => {
  const { state, emit } = mountBlock<{
    counts: Ref<{ present: number; late: number; absent: number; unmarked: number }>
    markRemaining: () => void
    mark: (id: string, status: string) => void
    save: () => void
  }>('class-attendance', {
    className: 'Grade 5',
    date: '2026-10-16',
    students: [
      { id: 'a', name: 'Alex', initials: 'AT' },
      { id: 'b', name: 'Jamie', initials: 'JT', status: 'absent' },
    ],
  })
  state.save()
  expect(emit).not.toHaveBeenCalled()
  state.markRemaining()
  expect(state.counts.value).toEqual({ present: 1, late: 0, absent: 1, unmarked: 0 })
  state.mark('a', 'late')
  state.save()
  expect(emit).toHaveBeenCalledWith('save', {
    className: 'Grade 5',
    date: '2026-10-16',
    attendance: [
      { id: 'a', status: 'late' },
      { id: 'b', status: 'absent' },
    ],
  })
})

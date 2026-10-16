import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { expect, it } from 'vitest'
import { previewStyleVersion } from '../apps/preview/asset-version'

it('invalidates preview asset URLs when Tailwind source classes change', () => {
  const root = mkdtempSync(join(tmpdir(), 'preview-styles-'))
  try {
    mkdirSync(join(root, 'blocks', 'login'), { recursive: true })
    writeFileSync(join(root, 'app.css'), '@source "./blocks";')
    const block = join(root, 'blocks/login/Login.vue')
    writeFileSync(block, '<template><view class="flex" /></template>')
    const old = previewStyleVersion(root)
    writeFileSync(block, '<template><view class="flex flex-col" /></template>')
    expect(previewStyleVersion(root)).not.toBe(old)
    expect(previewStyleVersion(root)).toBe(previewStyleVersion(root))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

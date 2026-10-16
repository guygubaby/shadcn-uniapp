import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export function previewStyleVersion(root: string): string {
  const hash = createHash('sha256').update(readFileSync(join(root, 'app.css')))
  function addDirectory(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) addDirectory(path)
      else hash.update(entry.name).update(readFileSync(path))
    }
  }
  addDirectory(join(root, 'blocks'))
  return hash.digest('hex').slice(0, 12)
}

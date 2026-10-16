export function formatBlockSource(source: string): string {
  return source.trimStart().replace(/^(<script\b[^>]*>)(?:[ \t]*\r?\n){2,}/u, '$1\n')
}

import ts from 'typescript'

export function removePreviewI18n(source) {
  let code = source.replace(
    /^import \{ inject \} from 'vue'\r?\nconst t = inject[^\r\n]+\r?\n(?:[ \t]*\r?\n)*/m,
    '',
  )
  if (code === source) return source

  let match
  while ((match = /\bt\(/.exec(code))) {
    const parsed = ts.createSourceFile(
      'expression.ts',
      code.slice(match.index),
      ts.ScriptTarget.Latest,
      true,
    )
    const statement = parsed.statements[0]
    const call = ts.isExpressionStatement(statement) && statement.expression
    if (!call || !ts.isCallExpression(call) || call.arguments.length !== 1) {
      throw new Error('Expected a preview translation call with one argument.')
    }
    code =
      code.slice(0, match.index) +
      call.arguments[0].getText(parsed) +
      code.slice(match.index + call.end)
  }
  return code
}

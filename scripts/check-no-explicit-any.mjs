import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const cwd = process.cwd()
const requireFromCwd = createRequire(path.join(cwd, 'package.json'))
const ts = requireFromCwd('typescript')

const targets = process.argv.slice(2)

if (targets.length === 0) {
  console.error('Usage: node check-no-explicit-any.mjs <dir> [dir...]')
  process.exit(1)
}

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts'])
const ignoredDirs = new Set(['node_modules', 'dist', '.nx'])
const violations = []

for (const target of targets) {
  const fullTarget = path.resolve(cwd, target)
  if (!fs.existsSync(fullTarget)) continue
  walk(fullTarget)
}

if (violations.length > 0) {
  console.error('Explicit `any` is not allowed:')
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exit(1)
}

function walk(entryPath) {
  const stats = fs.statSync(entryPath)
  if (stats.isDirectory()) {
    for (const child of fs.readdirSync(entryPath)) {
      if (ignoredDirs.has(child)) continue
      walk(path.join(entryPath, child))
    }
    return
  }

  const ext = path.extname(entryPath)
  if (!SOURCE_EXTENSIONS.has(ext) || entryPath.endsWith('.d.ts')) return

  const sourceText = fs.readFileSync(entryPath, 'utf8')
  const sourceFile = ts.createSourceFile(entryPath, sourceText, ts.ScriptTarget.Latest, true)

  visit(sourceFile, sourceText, sourceFile)
}

function visit(node, sourceText, sourceFile) {
  if (node.kind === ts.SyntaxKind.AnyKeyword) {
    const start = node.getStart(sourceFile)
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(start)
    const sourceLine = sourceText.split(/\r?\n/u)[line]?.trim() ?? ''
    violations.push(`${path.relative(cwd, sourceFile.fileName)}:${line + 1}:${character + 1} ${sourceLine}`)
  }

  ts.forEachChild(node, (child) => visit(child, sourceText, sourceFile))
}

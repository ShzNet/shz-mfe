#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const [, , ...dirs] = process.argv
if (!dirs.length) {
  console.error('Usage: check-no-explicit-any.mjs <dir> [dir...]')
  process.exit(1)
}

async function collectFiles(dir) {
  const files = []
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry)
    const s = await stat(full)
    if (s.isDirectory()) files.push(...(await collectFiles(full)))
    else if (['.ts', '.tsx'].includes(extname(entry))) files.push(full)
  }
  return files
}

const violations = []
for (const dir of dirs) {
  for (const file of await collectFiles(dir)) {
    const lines = (await readFile(file, 'utf8')).split('\n')
    lines.forEach((line, i) => {
      if (/:\s*any\b/.test(line) && !line.trimStart().startsWith('//'))
        violations.push(`${file}:${i + 1}  ${line.trim()}`)
    })
  }
}

if (violations.length) {
  console.error('Explicit `any` found:')
  violations.forEach((v) => console.error(' ', v))
  process.exit(1)
}

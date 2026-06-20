#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'

const [, , ...dirs] = process.argv
if (!dirs.length) {
  console.error('Usage: check-no-explicit-any.mjs <dir> [dir...]')
  process.exit(1)
}

async function collectFiles(dir) {
  const files = []
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry)
    const fileStat = await stat(full)
    if (fileStat.isDirectory()) {
      files.push(...(await collectFiles(full)))
      continue
    }

    if (['.ts', '.tsx'].includes(extname(entry))) {
      files.push(full)
    }
  }

  return files
}

const violations = []

for (const dir of dirs) {
  for (const file of await collectFiles(dir)) {
    const lines = (await readFile(file, 'utf8')).split('\n')
    lines.forEach((line, index) => {
      if (/:\s*any\b/.test(line) && !line.trimStart().startsWith('//')) {
        violations.push(`${file}:${index + 1}  ${line.trim()}`)
      }
    })
  }
}

if (violations.length) {
  console.error('Explicit `any` found:')
  violations.forEach((violation) => console.error(' ', violation))
  process.exit(1)
}

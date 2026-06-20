import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const dist = resolve(root, 'dist')

rmSync(dist, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

cpSync(resolve(root, 'src'), resolve(dist, 'src'), { recursive: true })
cpSync(resolve(root, 'generators.json'), resolve(dist, 'generators.json'))

const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
delete packageJson.scripts

writeFileSync(resolve(dist, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)

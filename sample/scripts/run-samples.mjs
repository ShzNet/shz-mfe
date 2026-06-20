#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = fileURLToPath(new URL('.', import.meta.url))
const sampleRoot = resolve(here, '..')

const processes = [
  {
    label: 'host',
    cwd: resolve(sampleRoot, 'host-ws'),
    args: ['--dir', resolve(sampleRoot, 'host-ws'), 'dev:sample-host'],
  },
  {
    label: 'sales',
    cwd: resolve(sampleRoot, 'remote-ws-1'),
    args: ['--dir', resolve(sampleRoot, 'remote-ws-1'), 'dev:remote-sales'],
  },
  {
    label: 'hr',
    cwd: resolve(sampleRoot, 'remote-ws-2'),
    args: ['--dir', resolve(sampleRoot, 'remote-ws-2'), 'dev:remote-hr'],
  },
]

const children = processes.map(startProcess)
let isShuttingDown = false

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => shutdown(0, signal))
}

Promise.all(children.map(waitForExit))
  .then((codes) => {
    const failedCode = codes.find((code) => code !== 0) ?? 0
    shutdown(failedCode)
  })
  .catch((error) => {
    console.error(error)
    shutdown(1)
  })

function startProcess(processConfig) {
  const child = spawn('pnpm', processConfig.args, {
    cwd: processConfig.cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: process.env,
  })

  pipeStream(child.stdout, processConfig.label)
  pipeStream(child.stderr, processConfig.label)

  child.on('error', (error) => {
    console.error(formatLine(processConfig.label, error.message))
  })

  return child
}

function pipeStream(stream, label) {
  let buffer = ''

  stream.on('data', (chunk) => {
    buffer += chunk.toString()
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line) continue
      console.log(formatLine(label, line))
    }
  })

  stream.on('end', () => {
    if (!buffer) return
    console.log(formatLine(label, buffer))
  })
}

function formatLine(label, line) {
  return `[${label}] ${line}`
}

function waitForExit(child) {
  return new Promise((resolvePromise) => {
    child.on('exit', (code) => resolvePromise(code ?? 0))
  })
}

function shutdown(code, signal) {
  if (isShuttingDown) return
  isShuttingDown = true

  for (const child of children) {
    if (child.exitCode === null && !child.killed) {
      child.kill(signal ?? 'SIGTERM')
    }
  }

  process.exitCode = code
}

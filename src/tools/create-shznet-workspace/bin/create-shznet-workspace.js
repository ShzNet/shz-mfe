#!/usr/bin/env node

let main

try {
  ;({ main } = require('@shznet/nx-generators/create-workspace'))
} catch {
  ;({ main } = require('../../nx-generators/src/create-workspace/cli.js'))
}

main()

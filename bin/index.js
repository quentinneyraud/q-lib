#!/usr/bin/env node

const args = process.argv.splice(process.execArgv.length + 2)
const cmd = args[0]
const directory = args[1]

if (cmd === 'create-new') {
  require('../tasks/generate/index')({
    directory
  })
} else {
  const { logHelp } = require('../tasks/generate/log')
  logHelp()
}

/* eslint-disable no-console */

const generatorPackageInformations = require('../../../package.json')

// Colors utils
const RESET = '\x1b[0m'
const TEXT_COLOR_GREEN = '\x1b[32m'
const TEXT_COLOR_RED = '\x1b[31m'
const TEXT_REVERSE = '\x1b[7m'
const TEXT_BRIGHT = '\x1b[1m'
const TEXT_UNDERSCORE = '\x1b[4m'

const red = str => console.log(`${TEXT_COLOR_RED}${str}${RESET}`)

const green = str => console.log(`${TEXT_COLOR_GREEN}${str}${RESET}`)

const title = str => console.log(`${TEXT_BRIGHT}${TEXT_REVERSE}${str}${RESET}`)

const blankLine = (n = 1) => (n > 0) ? console.log('\n'.repeat(n - 1)) : null

const logSuccessMessage = (config) => {
  let stepIndex = 1
  console.clear()
  green(`${config.package.name} is now ready !`)

  blankLine()

  console.log('What\'s next ?')

  blankLine(1)

  title(` ${stepIndex++}. Install packages `)
  console.log(`cd ${config.directory} && yarn install`)

  blankLine()

  title(` ${stepIndex++}. Init a new git repository `)
  console.log(`git init`)
  console.log(`git add . && git commit -m "Initial commit - from @qneyraud/q-lib"`)

  if (config.features.example) {
    blankLine()

    title(` ${stepIndex++}. Start coding `)
    console.log('yarn dev')
    console.log('Go to http://localhost:1234')
  }

  if (config.features.documentation) {
    blankLine()

    title(` ${stepIndex++}. Write documentation `)
    console.log('yarn docs')
    console.log('Go to http://localhost:3000')
  }

  blankLine()

  title(` ${stepIndex++}. Deploy `)
  console.log('npm publish')

  if (config.features.documentation) {
    blankLine()

    title(` ${stepIndex++}. Deploy documentation `)
    console.log('With Github Pages: Push to your github repository with Github pages set to /docs')
    console.log('Other methods: https://docsify.js.org/#/deploy')
  }

  blankLine(1)
}

const logHelp = () => {
  blankLine()

  console.log(`${generatorPackageInformations.name} ${generatorPackageInformations.version}`)
  console.log(`${TEXT_UNDERSCORE}Documentation:${RESET} ${generatorPackageInformations.homepage}`)

  blankLine()

  console.log(`${TEXT_BRIGHT}Usage${RESET}`)

  console.log('    q-lib create-new [directory]            Create a new project')
}

const logError = error => {
  red(error.message)

  blankLine()

  console.log(error)
}

module.exports = {
  blankLine,
  logSuccessMessage,
  logHelp,
  logError
}

// Colors utils
const RESET = '\x1b[0m'
const TEXT_COLOR_GREEN = '\x1b[32m'
const TEXT_COLOR_RED = '\x1b[31m'
const TEXT_UNDERLINE = '\x1b[4m'

const red = str => console.log(`${TEXT_COLOR_RED}${str}${RESET}`)

const green = str => console.log(`${TEXT_COLOR_GREEN}${str}${RESET}`)

const underline = str => console.log(`${TEXT_UNDERLINE}${str}${RESET}`)

const blankLine = (n = 1) => (n > 0) ? console.log('\n'.repeat(n - 1)) : null

const logSuccessMessage = ({ packageName }) => {
  console.clear()
  green('Your library is now ready !')

  blankLine()

  console.log('What\'s next ?')

  blankLine(1)

  underline('1. Install packages')
  console.log(`cd ${packageName} && yarn install`)

  blankLine()

  underline('2. Start coding')
  console.log('yarn dev')
  console.log('Go to http://localhost:1234')

  blankLine()

  underline('3. Write documentation')
  console.log('yarn docs')
  console.log('Go to http://localhost:3000')

  blankLine()

  underline('4. Deploy')
  console.log('npm publish')

  blankLine(1)
}

const logError = error => {
  red(error.message)
}

module.exports = {
  blankLine,
  logSuccessMessage
}

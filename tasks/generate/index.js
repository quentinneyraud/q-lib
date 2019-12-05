const getUserInput = require('./userInput')
const moveFiles = require('./files')
const { logSuccessMessage, logError } = require('./log')

module.exports = async ({ directory }) => {
  const userInput = await getUserInput()

  moveFiles(userInput, { directory })
    .then(logSuccessMessage.bind(null, userInput))
    .catch(err => {
      logError(err)
    })
}

const getUserInput = require('./userInput')
const moveFiles = require('./files')
const { logSuccessMessage } = require('./log')

module.exports = async () => {
  const userInput = await getUserInput()

  moveFiles(userInput)
    .then(logSuccessMessage.bind(null, userInput))
    .catch(err => {
      console.log('Error', err)
    })
}

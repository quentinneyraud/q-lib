const getUserInput = require('./userInput')
const moveFiles = require('./files')
const { logSuccessMessage } = require('./log')

module.exports = () => {
  logSuccessMessage({
    packageName: 'my-awesome-library'
  })
  // getUserInput()
  //   .then(moveFiles)
  //   .then(d => {
  //     console.log('OK')
  //   })
  //   .catch(err => {
  //     console.log('Error', err)
  //   })
}

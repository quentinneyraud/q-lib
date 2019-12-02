// const fs = require('fs')
const getUserInput = require('./userInput')
const moveFiles = require('./files')

// getUserInput()
//   .then(moveFiles)
moveFiles({ libraryName: 'My awesome library',
  libraryDescription: 'My awesome library is doing awesome things',
  fullPackageName: 'my-awesome-library',
  features:
 { eslint: false,
   testing: true,
   polyfilled: true,
   minified: true,
   documentation: false },
  repositoryUrl: '',
  documentationUrl: '',
  packageName: 'my-awesome-library',
  packageScope: undefined,
  packageNamePascalCase: 'MyAwesomeLibrary' })
  .then(d => {
    console.log('OK')
  })
  .catch(err => {
    console.log('Error', err)
  })

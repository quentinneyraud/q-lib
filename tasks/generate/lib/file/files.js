const path = require('path')
const TemplateFile = require('./TemplateFile')
const PackageJsonTemplateFile = require('./PackageJsonTemplateFile')
const { createNewDirectory, getAllFiles } = require('../utils')
const TEMPLATE_ROOT = path.resolve(__dirname, '../../templates')

module.exports = async config => {
  const packageRoot = path.resolve(process.cwd(), config.directory)

  // Create package directory
  try {
    await createNewDirectory(packageRoot)
  } catch (err) {
    if (err.code === 'EEXIST') {
      throw new Error(`The directory ${packageRoot} already exists`)
    }
    throw new Error(err)
  }

  // Get simple glob
  return getAllFiles(TEMPLATE_ROOT)
    // Create File instances
    .then(filesPaths => {
      return filesPaths.map(filePath => {
        let ClassName = TemplateFile

        if (/package\.json/.test(path.basename(filePath))) {
          ClassName = PackageJsonTemplateFile
        }

        return new ClassName(filePath, { packageRoot, templateRoot: TEMPLATE_ROOT }, config)
      })
    })
    // Keep only files useful for the checked features
    .then(files => files.filter(file => file.isNeeded()))

    // Create promise of all files processing
    .then(files => {
      const promises = files.map(file => file.process())
      return Promise.all(promises)
    })
}

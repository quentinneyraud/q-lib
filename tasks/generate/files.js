const path = require('path')
const TemplateFile = require('./file/TemplateFile')
const PackageJsonTemplateFile = require('./file/PackageJsonTemplateFile')
const { createNewDirectory, getAllFiles } = require('./utils')

module.exports = (packageInfos, { directory }) => {
  const templateRoot = path.resolve(__dirname, './templates')
  const packageRoot = path.resolve(process.cwd(), directory || packageInfos.packageName)

  return createNewDirectory(packageRoot)
    // Get simple glob
    .then(getAllFiles.bind(null, templateRoot))

    // Create File instances
    .then(files => files.map(file => {
      let ClassName = TemplateFile

      // special class for package.json file, get interpolation + valid JSON is a nightmare :/
      if (/package\.json/.test(path.basename(file))) {
        ClassName = PackageJsonTemplateFile
      }

      return new ClassName(file, { packageRoot, templateRoot }, packageInfos)
    }))

    // Keep only files useful for the checked features
    .then(files => files.filter(file => file.isNeeded()))

    // Create promise of all files processing
    .then(files => {
      const promises = files.map(file => {
        return file.process()
      })
      return Promise.all(promises)
    })

  // Friendly errors and throw uncaught
    .catch(err => {
      if (err.code === 'EEXIST') {
        throw new Error(`The directory ${packageRoot} already exists`)
      }

      throw new Error(err)
    })
}

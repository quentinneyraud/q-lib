const glob = require('glob')
const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const fsPromises = fs.promises

const TEMPLATES_ROOT = path.resolve(__dirname, './templates')

const getAllFiles = () => {
  return new Promise((resolve, reject) => {
    glob(TEMPLATES_ROOT + '/**/*', {
      nodir: true,
      dot: true
    }, (err, files) => {
      if (err) reject(err)
      resolve(files)
    })
  })
}

const createNewDirectory = (directoryPath, recursive = false) => {
  return fsPromises.mkdir(directoryPath, {
    recursive
  })
}

const getProcessedFileContent = (filePath, datas = {}) => {
  return ejs.renderFile(filePath, datas, {
    async: true
  })
}

const writeFile = (filePath, content) => {
  return createNewDirectory(path.dirname(filePath), true)
    .then(fsPromises.writeFile.bind(null, filePath, content))
}

const filterFiles = (files, config) => {
  return files.filter(file => {
    const rel = path.relative(TEMPLATES_ROOT, file)
    if (path.basename === '.eslintrc.js') return config.features.eslint
    if (rel === '.babelrc') return config.features.polyfilled
    if (rel.includes('docs')) return config.features.documentation

    return true
  })
}

module.exports = (config) => {
  const PACKAGE_ROOT = path.resolve(process.cwd(), config.fullPackageName)

  return createNewDirectory(PACKAGE_ROOT)
    .then(getAllFiles)
    .then(files => filterFiles(files, config))
    .then(files => {
      const promises = files.map(file => {
        const filePath = path.resolve(PACKAGE_ROOT, path.relative(TEMPLATES_ROOT, file))

        return getProcessedFileContent(file, config)
          .then(fileContent => writeFile(filePath, fileContent))
      })
      return Promise.all(promises)
    })
    .catch(err => {
      if (err.code === 'EEXIST') {
        throw new Error(err)
      }

      throw new Error(err)
    })
}

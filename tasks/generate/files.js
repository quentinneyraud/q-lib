const glob = require('glob')
const path = require('path')
const ejs = require('ejs')
const fs = require('fs')
const fsPromises = fs.promises

const TEMPLATES_ROOT = path.resolve(__dirname, './templates')
let PACKAGE_ROOT

/**
 * Async create new directory
 *
 * @param {string} directoryPath - The path of the directory
 * @param {boolean} recursive - Create recursively
 *
 * @returns {Promise}
 */
const createNewDirectory = (directoryPath, recursive = false) => {
  return fsPromises.mkdir(directoryPath, {
    recursive
  })
}

class File {
  /**
   * Create a new File instance
   *
   * @param {string} filePath - File path
   * @param {*} packageInfos - New package infos
   */
  constructor (filePath, packageInfos) {
    this.filePath = filePath
    this.packageInfos = packageInfos

    this.setInfos()
  }

  /**
   * Set path infos
   */
  setInfos () {
    // file path relative to templates directory
    this.relativeFilePath = path.relative(TEMPLATES_ROOT, this.filePath)

    // destination file path in new package : package root + relative root + filename without ejs extension
    this.packageFilePath = path.resolve(PACKAGE_ROOT, path.dirname(this.relativeFilePath), path.basename(this.filePath, '.ejs'))
  }

  /**
   * Return whether this file should be moved to the package
   *
   * @returns {boolean}
   */
  isNeeded () {
    if (/\.eslintrc\.js/.test(this.relativeFilePath)) return this.packageInfos.features.eslint
    if (/\.babelrc/.test(this.relativeFilePath)) return this.packageInfos.features.polyfilled
    if (/docs/.test(this.relativeFilePath)) return this.packageInfos.features.documentation
    if (/example/.test(this.relativeFilePath)) return this.packageInfos.features.testing
    return true
  }

  /**
   * Async return the content of the file after EJS render
   *
   * @returns {Promise}
   */
  getContent () {
    return ejs.renderFile(this.filePath, this.packageInfos, {
      async: true
    })
  }

  /**
   * Create the file in the package directory, create his own directory if needed
   *
   * @param {string} content - content of the file
   *
   * @returns {Promise}
   */
  createFileInPackage (content) {
    return createNewDirectory(path.dirname(this.packageFilePath), true)
      .then(_ => fsPromises.writeFile(this.packageFilePath, content))
  }

  /**
   * All file process
   *
   * @returns {Promise}
   */
  process () {
    return this.getContent()
      .then(this.createFileInPackage.bind(this))
  }
}

/**
 * Return all files (including hidden) in the templates directory
 *
 * @returns {Array} - All files
 */
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

module.exports = (packageInfos, { directory }) => {
  PACKAGE_ROOT = path.resolve(process.cwd(), directory || packageInfos.packageName)

  return createNewDirectory(PACKAGE_ROOT)
    // Get simple glob
    .then(getAllFiles)

    // Create File instances
    .then(files => files.map(file => new File(file, packageInfos)))

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
        throw new Error(`The directory ${PACKAGE_ROOT} already exists`)
      }

      throw new Error(err)
    })
}

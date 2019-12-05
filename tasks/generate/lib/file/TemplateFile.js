const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const fsPromises = fs.promises
const { createNewDirectory } = require('../utils')

module.exports = class TemplateFile {
  /**
   * Create a new File instance
   *
   * @param {string} filePath - File path
   * @param {*} packageInfos - New package infos
   */
  constructor (filePath, { templateRoot, packageRoot }, packageInfos) {
    this.filePath = filePath
    this.templateRoot = templateRoot
    this.packageRoot = packageRoot
    this.packageInfos = packageInfos

    this.setInfos()
  }

  /**
   * Set path infos
   */
  setInfos () {
    // file path relative to templates directory
    this.relativeFilePath = path.relative(this.templateRoot, this.filePath)

    // destination file path in new package : package root + relative root + filename without ejs extension
    this.packageFilePath = path.resolve(this.packageRoot, path.dirname(this.relativeFilePath), path.basename(this.filePath, '.ejs'))
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

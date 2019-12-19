const TemplateFile = require('./TemplateFile')

module.exports = class PackageJsonTemplateFile extends TemplateFile {
  getContent () {
    return new Promise((resolve) => {
      // User
      let user = null
      if (this.packageInfos.userEmail.length > 0 || this.packageInfos.userEmail.length > 0) {
        user = {}
        if (this.packageInfos.userName.length > 0) user.name = this.packageInfos.userName
        if (this.packageInfos.userEmail.length > 0) user.email = this.packageInfos.userEmail
      }

      // base
      const content = {
        name: this.packageInfos.fullPackageName,
        version: '1.0.0',
        license: 'ISC'
      }

      // description
      if (this.packageInfos.libraryDescription) {
        content.description = this.packageInfos.libraryDescription
      }

      // keywords
      content.keywords = []

      // author
      if (user) {
        content.author = user
      }

      // maintainers
      if (user) {
        content.maintainers = [user]
      }

      // contributors
      if (user) {
        content.contributors = [user]
      }

      // homepage
      if (this.packageInfos.documentationUrl) {
        content.homepage = this.packageInfos.documentationUrl
      }

      // repository
      if (this.packageInfos.repositoryUrl) {
        content.repository = {
          type: 'git',
          url: this.packageInfos.repositoryUrl
        }
      }

      // bugs
      if (this.packageInfos.repositoryUrl || this.packageInfos.userEmail) {
        content.bugs = {}

        if (this.packageInfos.userEmail) {
          content.bugs.email = this.packageInfos.userEmail
        }

        if (this.packageInfos.repositoryUrl) {
          content.bugs.url = this.packageInfos.repositoryUrl + '/issues'
        }
      }

      // main file
      content.main = `umd/${this.packageInfos.packageName}.min.js`

      // files
      content.files = ['umd/*']

      // scripts
      content.scripts = {}
      if (this.packageInfos.features.eslint) {
        content.scripts.build = 'npm run lint && rollup --config'
        content.scripts.lint = 'eslint src/*'
      } else {
        content.scripts.build = 'rollup --config'
      }
      content.scripts.prepublish = 'npm run build'
      if (this.packageInfos.features.testing) {
        content.scripts.dev = 'parcel example/index.html'
      }
      if (this.packageInfos.features.documentation) {
        content.scripts.docs = 'docsify serve ./docs'
      }

      // devDependencies
      content.devDependencies = {}
      if (this.packageInfos.features.polyfilled) {
        content.devDependencies['@babel/core'] = '^7.6.0'
        content.devDependencies['@babel/preset-env'] = '^7.6.0'
      }
      if (this.packageInfos.features.eslint) {
        content.devDependencies['@qneyraud/eslint-config'] = '^1.0.3'
      }
      if (this.packageInfos.features.documentation) {
        content.devDependencies['docsify-cli'] = '^4.3.0'
      }
      if (this.packageInfos.features.eslint) {
        content.devDependencies['eslint'] = '^5.16.0'
        content.devDependencies['eslint-config-standard'] = '^12.0.0'
        content.devDependencies['eslint-plugin-import'] = '^2.17.3'
        content.devDependencies['eslint-plugin-node'] = '^9.1.0'
        content.devDependencies['eslint-plugin-promise'] = '^4.1.1'
        content.devDependencies['eslint-plugin-standard'] = '^4.0.0'
      }
      if (this.packageInfos.features.testing) {
        content.devDependencies['parcel-bundler'] = '^1.12.3'
      }
      content.devDependencies['rimraf'] = '^3.0.0'
      content.devDependencies['rollup'] = '^1.15.6'
      if (this.packageInfos.features.polyfilled) {
        content.devDependencies['rollup-plugin-babel'] = '^4.3.3'
      }
      content.devDependencies['rollup-plugin-commonjs'] = '^10.1.0'
      content.devDependencies['rollup-plugin-node-resolve'] = '^5.2.0'
      content.devDependencies['rollup-plugin-terser'] = '^5.0.0'

      // dependencies
      if (this.packageInfos.features.polyfilled) {
        content.dependencies = {
          'core-js': '3'
        }
      }

      resolve(JSON.stringify(content, null, 2))
    })
  }
}
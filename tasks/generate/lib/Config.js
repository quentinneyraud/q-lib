const { isUrl, slugify, parsePackageName, toPascalCase, getGitUser, isEmail } = require('./utils')
const inquirer = require('inquirer')
const validateNpm = require('validate-npm-package-name')

const FEATURES = ['eslint', 'example', 'polyfilled', 'documentation']

module.exports = class Config {
  constructor ({ directory }) {
    this.config = {
      title: null,
      description: null,
      package: {
        fullName: null,
        name: null,
        scope: null
      },
      features: {
        eslint: false,
        example: false,
        polyfilled: false,
        documentation: false
      },
      repository: null,
      documentation: null,
      user: {
        name: null,
        email: null
      },
      directory
    }
  }

  init () {
    return getGitUser()
      .then(gitUser => this.config.user = { ...this.config.user, ...gitUser })
  }

  getConfig () {
    return this.config
  }

  getQuestions () {
    return [
      {
        type: 'input',
        name: 'title',
        message: 'Library name (required)',
        default: 'My awesome library'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Library description',
        default: currentSession => `${currentSession.title} is doing awesome things`
      },
      {
        type: 'input',
        name: 'packageFullName',
        message: 'Full package name with scope if needed (required)',
        default: currentSession => slugify(currentSession.title),
        validate: value => {
          const validation = validateNpm(value)

          if (validation.validForNewPackages) {
            return true
          } else {
            return (validation.errors && validation.errors[0]) || (validation.warnings && validation.warnings[0])
          }
        }
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Features',
        choices: [
          new inquirer.Separator(' = Develop = '), {
            name: 'Lint sources directory',
            value: 'eslint',
            checked: true
          }, {
            name: 'Example for testing in development',
            value: 'example',
            checked: true
          },
          new inquirer.Separator(' = Deploy = '), {
            name: 'Build polyfilled version',
            value: 'polyfilled',
            checked: true
          }, {
            name: 'Create documentation',
            value: 'documentation',
            checked: true
          }]
      }, {
        type: 'input',
        name: 'repository',
        message: 'Repository URL',
        validate: (value) => {
          if (value.length === 0) return true

          return isUrl(value) ? true : `${value} is not a valid URL`
        }
      }, {
        type: 'input',
        when: currentSession => currentSession.features.indexOf('documentation') > -1,
        name: 'documentation',
        message: 'Documentation URL',
        default: currentSession => {
          if (!currentSession.repository) return ''

          if (/https?:\/\/github.intuit.com\/[^/]+\/[^/]+/.test(currentSession.repository)) { return currentSession.repository.length > 0 ? currentSession.repository : '' }
        },
        validate: (value) => {
          if (value.length === 0) return true

          return isUrl(value) ? true : `${value} is not a valid URL`
        }
      }, {
        type: 'input',
        name: 'userName',
        message: 'Package author name',
        default: this.config.user.name
      }, {
        type: 'input',
        name: 'userEmail',
        message: 'Package author email',
        default: this.config.user.email,
        validate: value => isEmail(value)
      }
    ]
  }

  setUserFromGit () {
    return getGitUser()
      .then(gitUser => this.config.user = { ...this.config.user, gitUser })
  }

  setConfigFromCli () {
    return inquirer.prompt(this.getQuestions())
      .then(this.fillConfigWithCliAnswers.bind(this))
  }

  fillConfigWithCliAnswers (cliAnswers) {
    const packageInfos = parsePackageName(cliAnswers.packageFullName)

    // Default config override
    this.config = {
      ...this.config,
      title: cliAnswers.title,
      description: cliAnswers.description
    }

    // Package infos
    this.config.package = {
      fullName: cliAnswers.packageFullName,
      name: packageInfos.name,
      scope: packageInfos.scope,
      namePascalCase: toPascalCase(packageInfos.name)
    }

    // Features
    // Cli return array of checked features => transform to get all features to true or false
    this.config.features = FEATURES.reduce((acc, curr) => {
      acc[curr] = cliAnswers.features.indexOf(curr) > -1
      return acc
    }, {})

    // User
    // Override if provided by CLI
    if (cliAnswers.userName) this.config.user.name = cliAnswers.userName
    if (cliAnswers.userEmail) this.config.user.email = cliAnswers.userEmail

    // Directory
    if (!this.config.directory) {
      this.config.directory = packageInfos.name
    }
  }
}

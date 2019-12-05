const { isUrl, slugify, parsePackageName, toPascalCase, getGitUser, isEmail } = require('./utils')
const inquirer = require('inquirer')
const validateNpm = require('validate-npm-package-name')

const FEATURES = ['eslint', 'testing', 'polyfilled', 'documentation']

const getQuestions = ({ gitUser }) => {
  return [
    {
      type: 'input',
      name: 'libraryName',
      message: 'Library name (required)',
      default: 'My awesome library'
    },
    {
      type: 'input',
      name: 'libraryDescription',
      message: 'Library description',
      default: currentSession => `${currentSession.libraryName} is doing awesome things`
    },
    {
      type: 'input',
      name: 'fullPackageName',
      message: 'Full package name with scope if needed (required)',
      default: currentSession => slugify(currentSession.libraryName),
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
          value: 'testing',
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
      name: 'repositoryUrl',
      message: 'Repository URL',
      validate: (value) => {
        if (value.length === 0) return true

        return isUrl(value) ? true : `${value} is not a valid URL`
      }
    }, {
      type: 'input',
      when: currentSession => currentSession.features.indexOf('documentation') > -1,
      name: 'documentationUrl',
      message: 'Documentation URL',
      default: currentSession => currentSession.repositoryUrl.length > 0 ? currentSession.repositoryUrl : '',
      validate: (value) => {
        if (value.length === 0) return true

        return isUrl(value) ? true : `${value} is not a valid URL`
      }
    }, {
      type: 'input',
      name: 'userName',
      message: 'Package author name',
      default: gitUser.name
    }, {
      type: 'input',
      name: 'userEmail',
      message: 'Package author email',
      default: gitUser.email,
      validate: value => isEmail(value)
    }
  ]
}

const processAnswers = config => {
  const packageInfos = parsePackageName(config.fullPackageName)

  return {
    ...config,
    packageName: packageInfos.name,
    packageScope: packageInfos.scope,
    packageNamePascalCase: toPascalCase(packageInfos.name),
    features: FEATURES.reduce((acc, curr) => {
      acc[curr] = config.features.indexOf(curr) > -1
      return acc
    }, {})
  }
}

module.exports = async () => {
  const gitUser = await getGitUser()

  return inquirer.prompt(getQuestions({ gitUser }))
    .then(processAnswers)
}

const Config = require('./lib/Config')
const moveFiles = require('./lib/file/files')
const { logSuccessMessage, logError } = require('./lib/log')

module.exports = async ({ directory }) => {
  const config = new Config({ directory })

  config.init()
    .then(config.setConfigFromCli.bind(config))
    .then(moveFiles.bind(null, config))
    .then(logSuccessMessage.bind(null, config))
    .catch(err => {
      logError(err)
    })
}

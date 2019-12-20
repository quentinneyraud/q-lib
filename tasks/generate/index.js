const Config = require('./lib/Config')
const moveFiles = require('./lib/file/files')
const { logSuccessMessage, logError } = require('./lib/log')

module.exports = async ({ directory }) => {
  const config = new Config({ directory })

  try {
    // Get config
    const projectConfig = await config.init()
      .then(_ => config.setConfigFromCli())
      .then(_ => config.getConfig())

    // Move files
    await moveFiles(projectConfig)

    // Log success message
    logSuccessMessage(projectConfig)
  } catch (err) {
    logError(err)
  }
}

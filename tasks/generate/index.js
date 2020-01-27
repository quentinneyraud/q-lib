const config = require('./lib/Config')
const moveFiles = require('./lib/file/files')
const { logSuccessMessage, logError } = require('./lib/log')

module.exports = async ({ directory }) => {
  // set directory name from CLI arg
  if (directory) {
    config.setDirectory(directory)
  }

  try {
    // Get config
    const projectConfig = await config.getProjectConfig()

    // Move files
    await moveFiles(projectConfig)

    // Log success message
    logSuccessMessage(projectConfig)
  } catch (err) {
    logError(err)
  }
}

/* eslint-disable global-require, import/no-dynamic-require, no-console */
const fs = require('fs')
const _ = require('lodash')
const path = require('path')

const root = path.join(__dirname, '../')

module.exports = (env = 'local', envVarsConfig = {}) => {
  const fallbackConfigPath = path.join(root, 'config', 'fallback')
  const configsToLoad = [fallbackConfigPath]

  const envConfigPath = path.join(root, 'config', 'environments', `${env}`)
  const isValidConfig = fs.existsSync(`${envConfigPath}.json`)

  if (!isValidConfig) {
    console.warn(`[WEBPACK]: invalid interface configuration selected: '${env}' - using fallback configuration`)
  } else {
    console.info(`[WEBPACK]: loaded env configuration: '${env}'`)
    configsToLoad.push(envConfigPath)
  }

  let applicationConfig = {}

  configsToLoad.forEach((configPath) => {
    let loadedConfig

    try {
      loadedConfig = require(`${configPath}.json`)
    } catch (err) {
      console.error(`Could not load config in ./${configPath}.json`)
      console.error(err)
    }

    applicationConfig = _.merge(applicationConfig, loadedConfig)
  })

  // use env config vars
  applicationConfig = _.merge(applicationConfig, envVarsConfig) // GNOSIS_CONFIG vars

  return applicationConfig
}

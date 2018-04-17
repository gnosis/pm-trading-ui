
module.exports = new Promise((resolve) => {
  const configLoader = require('./configuration')

  const { config, interfaceConfig } = configLoader('local')
  global.GNOSIS_CONFIG = config
  global.GNOSIS_INTERFACE = interfaceConfig

  resolve()
})

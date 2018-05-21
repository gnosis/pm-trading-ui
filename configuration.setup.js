const configLoader = require('./configuration')

const ENV = 'local'

// console.info(`[JEST]: using env configuration: '${ENV}'`)
const { config, interfaceConfig } = configLoader(ENV)
window.GNOSIS_CONFIG = config
window.GNOSIS_INTERFACE = interfaceConfig

global.GNOSIS_CONFIG = config
global.GNOSIS_INTERFACE = interfaceConfig

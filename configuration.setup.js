const configLoader = require('./configuration')

const { config, interfaceConfig } = configLoader('production')
window.GNOSIS_CONFIG = config
window.GNOSIS_INTERFACE = interfaceConfig

global.GNOSIS_CONFIG = config
global.GNOSIS_INTERFACE = interfaceConfig

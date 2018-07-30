const configLoader = require('./configuration')

const ENV = 'local'

// console.info(`[JEST]: using env configuration: '${ENV}'`)
const config = configLoader(ENV)
global.__GNOSIS_CONFIG__ = config

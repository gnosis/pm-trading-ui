/* globals process */
const fs = require('fs')

const { GNOSIS_ENV, GNOSIS_CONFIG } = process.env

const configLoader = require('./configuration.js')

const applicationConfiguration = configLoader(GNOSIS_ENV, GNOSIS_CONFIG)

fs.writeFileSync('../dist/config.js', `window__GNOSIS_CONFIG__ = ${JSON.stringify(applicationConfiguration)}`)
console.log('Config for env written to dist/config.js')

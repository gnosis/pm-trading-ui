/* globals process */
const fs = require('fs')
const path = require('path')

const GNOSIS_ENV = process.argv.splice(-1)[0]
const { GNOSIS_CONFIG } = process.env

console.log({ GNOSIS_ENV })

const configLoader = require('./configuration.js')

const applicationConfiguration = configLoader(GNOSIS_ENV, GNOSIS_CONFIG)

const configTarget = path.join(__dirname, '..', 'dist', 'config.js')
fs.writeFileSync(configTarget, `window__GNOSIS_CONFIG__ = ${JSON.stringify(applicationConfiguration)}`)
console.log('Config for env written to dist/config.js')

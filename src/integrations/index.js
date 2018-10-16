import { WALLET_PROVIDER } from './constants'

// eslint-disable-next-line
let providers = {}

Object.keys(WALLET_PROVIDER).forEach((integrationName) => {
  // eslint-disable-next-line
  const providerInstance = require(`./${integrationName.toLowerCase()}/index.js`).default
  if (providerInstance != null) {
    providers[providerInstance.constructor.providerName] = providerInstance
  } else {
    throw new Error(`Could not load provider ${integrationName}`)
  }
})

export default providers

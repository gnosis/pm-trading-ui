import { get, find, orderBy } from 'lodash'
import { WALLET_PROVIDER } from 'integrations/constants'
import Decimal from 'decimal.js'

/**
 * Finds a default provider from all currently available providers. Determined by provider integrations `priority`
 * @param {*} state - redux state
 */
export const findDefaultProvider = (state) => {
  const providers = orderBy(state.blockchain.providers, ['priority'], ['desc'])

  return find(providers, {
    loaded: true,
    available: true,
  })
}

export const getSelectedProvider = state => get(state, `blockchain.providers['${state.blockchain.activeProvider}']`)

export const getSelectedProviderName = state => get(state, 'blockchain.activeProvider')

/**
 * Returns the currently selected account for the current provider
 * @param {*} state - redux state
 */
export const getCurrentAccount = (state) => {
  const provider = getSelectedProvider(state)

  if (provider) {
    return provider.account
  }
}

export const checkWalletConnection = (state) => {
  const provider = getSelectedProvider(state)

  if (provider && provider.account) {
    return true
  }

  return false
}

/**
 * Returns the balance of the currently selected provider, network and account
 * @param {*} state - redux state
 */
export const getCurrentBalance = (state) => {
  const provider = getSelectedProvider(state)

  if (provider) {
    return provider.balance
  }
  return undefined
}

/**
 * Returns the current network id the selected provider is connected to
 * @param {*} state - redux state
 */
export const getCurrentNetwork = (state) => {
  const provider = getSelectedProvider(state)

  if (provider) {
    return provider.network
  }
  return undefined
}

/**
 * Returns the current network the selected provider is connected to
 * @param {*} state - redux state
 */
export const getCurrentNetworkId = (state) => {
  const provider = getSelectedProvider(state)

  if (provider) {
    return provider.networkId
  }
  return undefined
}

export const initializedAllProviders = (state) => {
  const providerNames = Object.keys(state.blockchain.providers)

  if (!providerNames.length) {
    return false
  }

  const allProvidersLoaded = providerNames.every(providerName => state.blockchain.providers[providerName].loaded)

  return allProvidersLoaded
}

export const getEtherTokensAmount = (state, account) =>
  new Decimal(get(state, `blockchain.etherTokens['${account}']`, 0))

export const getTargetNetworkId = state => get(state, `blockchain.providers['${WALLET_PROVIDER.REMOTE}'].networkId`)

export const isRemoteConnectionEstablished = state =>
  get(state, `blockchain.providers['${WALLET_PROVIDER.REMOTE}'].available`, false)

export const isConnectedToCorrectNetwork = (state) => {
  const targetNetworkId = getTargetNetworkId(state)
  const currentNetworkId = getCurrentNetworkId(state)

  return targetNetworkId === currentNetworkId
}

export const shouldOpenNetworkModal = state =>
  isRemoteConnectionEstablished(state) && checkWalletConnection(state) && !isConnectedToCorrectNetwork(state)

export const isOnWhitelist = (state) => {
  const account = getCurrentAccount(state)

  if (account) {
    return process.env.WHITELIST[account] !== undefined
  }

  return false
}

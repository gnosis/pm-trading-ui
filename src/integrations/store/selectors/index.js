import { WALLET_PROVIDER } from 'integrations/constants'

/**
 * Finds a default provider from all currently available providers. Determined by provider integrations `priority`
 * @param {*} state - redux state
 */
export const findDefaultProvider = (state) => {
  const providers = state.providers.get('providers')
  const providersSorted = providers.sort((a, b) => b - a)
  return providersSorted.find(({ available, loaded }) => available && loaded)
}

export const getActiveProviderName = state => state.providers.get('activeProvider')

export const getActiveProvider = (state) => {
  const activeProviderName = getActiveProviderName(state)
  const activeProvider = state.providers.getIn(['providers', activeProviderName])

  return activeProvider
}

/**
 * Returns the currently selected account for the current provider
 * @param {*} state - redux state
 */
export const getCurrentAccount = (state) => {
  const provider = getActiveProvider(state)

  if (provider) {
    return provider.account
  }
}

export const checkWalletConnection = (state) => {
  const provider = getActiveProvider(state)

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
  const provider = getActiveProvider(state)

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
  const provider = getActiveProvider(state)

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
  const provider = getActiveProvider(state)

  if (provider) {
    return provider.networkId
  }
  return undefined
}

export const initializedAllProviders = (state) => {
  const providers = state.providers.get('providers')

  const allProvidersLoaded = providers.every(({ loaded }) => loaded)

  return allProvidersLoaded
}

export const getTargetNetworkId = (state) => {
  const remoteProvider = state.providers.getIn(['providers', WALLET_PROVIDER.REMOTE])

  return remoteProvider.networkId
}

export const isRemoteConnectionEstablished = (state) => {
  const remoteProvider = state.providers.getIn(['providers', WALLET_PROVIDER.REMOTE])
  return remoteProvider.available
}

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

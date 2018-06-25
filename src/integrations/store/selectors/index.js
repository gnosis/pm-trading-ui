import { WALLET_PROVIDER } from 'integrations/constants'
import { getConfiguration, getFeatureConfig } from 'utils/features'
import { normalizeHex } from 'utils/helpers'

const config = getConfiguration()

const providerConfig = getFeatureConfig('providers')
const requireTOSAccept = !!providerConfig.requireTOSAccept

/**
 * Finds a default provider from all currently available providers. Determined by provider integrations `priority`
 * @param {*} state - redux state
 */
export const findDefaultProvider = (state) => {
  const providers = state.integrations.get('providers')
  const providersSorted = providers.sort((a, b) => b.priority - a.priority)
  return providersSorted.find(({ available, loaded }) => available && loaded)
}

export const getActiveProviderName = state => state && state.integrations && state.integrations.get('activeProvider')

export const getActiveProvider = (state) => {
  const activeProviderName = getActiveProviderName(state)

  let activeProvider
  if (activeProviderName) {
    activeProvider = state.integrations.getIn(['providers', activeProviderName])
  }

  return activeProvider
}

/**
 * Returns the currently selected account for the current provider
 * @param {*} state - redux state
 */
export const getCurrentAccount = (state) => {
  const provider = getActiveProvider(state)
  if (provider && provider.account) {
    return provider.account.toLowerCase()
  }

  return undefined
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
  const providers = state.integrations.get('providers')

  const allProvidersLoaded = providers.every(({ loaded }) => loaded)
  const providersAreRegistered = !!providers.size

  return providersAreRegistered && allProvidersLoaded
}

export const getTargetNetworkId = (state) => {
  const remoteProvider = state.integrations.getIn(['providers', WALLET_PROVIDER.REMOTE])

  if (remoteProvider) {
    return remoteProvider.networkId
  }
  return undefined
}

export const isRemoteConnectionEstablished = (state) => {
  const remoteProvider = state.integrations.getIn(['providers', WALLET_PROVIDER.REMOTE])
  const remoteProviderRegistered = !!remoteProvider

  return remoteProviderRegistered && !!remoteProvider.network
}

export const isConnectedToCorrectNetwork = (state) => {
  const targetNetworkId = getTargetNetworkId(state)
  const currentNetworkId = getCurrentNetworkId(state)

  return targetNetworkId === currentNetworkId
}

export const isMetamaskLocked = (state) => {
  const metamask = state.integrations.getIn(['providers', WALLET_PROVIDER.METAMASK])

  // If metamask is connected to some network, but there are not account available
  // Most likeliy it is locked

  return metamask && !metamask.account && !!metamask.network
}

export const getAccountSetting = (state, account, settingName, settingDefault) => (
  state.integrations.getIn(['accountSettings', normalizeHex(account), settingName], settingDefault)
)

export const getRegisteredMainnetAddress = (state) => {
  const account = getCurrentAccount(state)

  if (!account) {
    return undefined
  }

  return getAccountSetting(state, account, 'mainnetAddress')
}

export const getRewardClaimHash = (state) => {
  const account = getCurrentAccount(state)

  if (!account) {
    return undefined
  }

  return getAccountSetting(state, account, 'rewardClaimHash')
}

export const hasAcceptedTermsAndConditions = (state) => {
  if (!requireTOSAccept) {
    return true
  }

  const currentAccount = getCurrentAccount(state)

  // TODO: In the future we can check against which were accepted
  return getAccountSetting(state, currentAccount, 'acceptedDocuments', []).length > 0
}

export const checkWalletConnection = (state) => {
  const provider = getActiveProvider(state)
  const termsNotRequiredOrAccepted = hasAcceptedTermsAndConditions(state)

  if (termsNotRequiredOrAccepted && provider && provider.account) {
    return true
  }

  return false
}

export const shouldOpenNetworkModal = state =>
  isRemoteConnectionEstablished(state) && checkWalletConnection(state) && !isConnectedToCorrectNetwork(state)

export const isOnWhitelist = (state) => {
  const account = getCurrentAccount(state)

  if (account) {
    return config.whitelist[account] !== undefined
  }

  return false
}

import { WALLET_PROVIDER, WALLET_STATUS } from 'integrations/constants'
import { List } from 'immutable'
import { createSelector } from 'reselect'
import { getConfiguration, getFeatureConfig, isFeatureEnabled } from 'utils/features'
import { normalizeHex } from 'utils/helpers'

const config = getConfiguration()

const legalComplianceConfig = getFeatureConfig('legalCompliance')
const legalComplianceEnabled = isFeatureEnabled('legalCompliance')
const isTournament = isFeatureEnabled('tournament')
const requireRegistration = isFeatureEnabled('registration')
const requireVerification = isFeatureEnabled('verification')
const verificationConfig = getFeatureConfig('verification')

const legalDocuments = legalComplianceConfig.documents || []

/**
 * Finds a default provider from all currently available providers. Determined by provider integrations `priority`
 * @param {*} state - redux state
 */

export const getActiveProviderName = state => state.integrations && state.integrations.get('activeProvider')

export const getProvidersList = state => state.integrations.get('providers')

export const getProvider = (state, provider) => state.integrations.getIn(['providers', provider], {})

export const getTargetNetworkId = state => state.blockchain.get('targetNetworkId')

export const findActiveProvider = (state) => {
  const providers = getProvidersList(state)
  return providers && providers.find(({ status }) => status === WALLET_STATUS.INITIALIZED)
}

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
    return normalizeHex(provider.account)
  }

  return undefined
}

export const getRegisteredMainnetAddress = (state) => {
  const account = getCurrentAccount(state)

  return account ? state.integrations.getIn(['accountSettings', account, 'mainnetAddress']) : undefined
}

export const hasAcceptedTermsAndConditions = (state) => {
  if (!legalComplianceEnabled) {
    return true
  }

  if (isTournament && requireRegistration && getRegisteredMainnetAddress(state)) {
    return true
  }

  const requiredDocuments = List(legalDocuments.map(doc => doc.id))
  const documentsAccepted = state.integrations.get('documentsAccepted') || List()
  return documentsAccepted.isSuperset(requiredDocuments)
}

/**
 * Returns the balance of the currently selected provider, network and account
 * @param {*} state - redux state
 */
export const getCurrentBalance = (state) => {
  const provider = getActiveProvider(state)

  if (provider && provider.balance) {
    return provider.balance
  }

  return '0'
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

export const hasActiveProvider = (state) => {
  const providers = getProvidersList(state)

  const activeProvider = providers.find(({ status }) => status === WALLET_STATUS.INITIALIZED)

  return !!activeProvider
}

export const isRemoteConnectionEstablished = (state) => {
  const remoteProvider = state.integrations.getIn(['providers', WALLET_PROVIDER.REMOTE])
  const remoteProviderRegistered = !!remoteProvider

  return remoteProviderRegistered && !!remoteProvider.network
}

export const isConnectedToCorrectNetwork = createSelector(
  [getTargetNetworkId, getCurrentNetworkId],
  (targetNetworkId, currentNetworkId) => parseInt(targetNetworkId, 10) === parseInt(currentNetworkId, 10),
)

export const checkWalletConnection = (state) => {
  const provider = getActiveProvider(state)
  const termsNotRequiredOrAccepted = hasAcceptedTermsAndConditions(state) || (isTournament && !!getRegisteredMainnetAddress(state))

  if (termsNotRequiredOrAccepted && provider?.account) {
    return true
  }

  return false
}

export const isOnWhitelist = (state) => {
  const account = getCurrentAccount(state)

  if (account) {
    return config.whitelist[account] !== undefined
  }

  return false
}

export const isMetamaskLocked = (state) => {
  const metamask = state.integrations.getIn(['providers', WALLET_PROVIDER.METAMASK])

  // If metamask is connected to some network, but there are not account available
  // Most likeliy it is locked

  return metamask && !metamask.account && !!metamask.network
}

export const isVerified = (state) => {
  const account = getCurrentAccount(state)

  if (!requireVerification) return true

  return (
    account
    && state.integrations.getIn(['accountSettings', normalizeHex(account), 'verificatedWith'])
      === verificationConfig.handler
  )
}

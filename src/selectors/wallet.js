import _ from 'lodash'

export const selector = state => state.wallet

export const walletsLoaded = (state) => {
  const providers = _.get(selector(state), 'providers', {})

  const providerNames = Object.keys(providers)

  if (!providerNames.length) {
    return false
  }

  return providerNames.reduce((loaded, providerName) => {
    if (!providers[providerName] || !providers[providerName].loaded) {
      return false
    }
    return loaded
  }, true)
}
export const activeWallet = state => _.get(selector(state), `providers[${selector(state).activeProvider}]`, false)

export default {
  activeWallet,
}

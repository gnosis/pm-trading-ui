import Decimal from 'decimal.js'

export const selector = state => state.blockchain

export const getDefaultAccount = state => selector(state).defaultAccount

export const getGasCosts = (state) => {
  const gasCosts = selector(state).gasCosts
  return Object.keys(gasCosts).reduce((acc, item) =>
    ({ ...acc, [item]: gasCosts[item] ? gasCosts[item] : new Decimal(0) }), {})
}

export const isGasCostFetched = (state, property) => selector(state).gasCosts[property] !== undefined

export const getGasPrice = state => (
  selector(state).gasPrice ? new Decimal(parseInt(selector(state).gasPrice, 10)) : new Decimal(0)
)

export const isGasPriceFetched = state => selector(state).gasPrice !== undefined

export const getEtherTokensAmount = (state, account) => (
  selector(state).etherTokens !== undefined ? selector(state).etherTokens[account] : new Decimal(0)
)

export default {
  getDefaultAccount,
}

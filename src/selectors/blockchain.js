import { get, mapValues } from 'lodash'
import Decimal from 'decimal.js'

/**
 * Returns if gnosis.js is initialized or not
 * @param {*} state - redux state
 */
export const isGnosisInitialized = state => state.blockchain.gnosisInitialized

export const getGasCosts = (state) => {
  const gasCosts = get(state, 'blockchain.gasCosts', {})

  return mapValues(gasCosts, (cost) => {
    if (!cost) {
      return 0
    }

    return cost
  })
}

export const isGasCostFetched = (state, property) => get(state, `blockchain.gasCosts['${property}']`) !== undefined

export const getEtherTokensAmount = (state, account) =>
  new Decimal(get(state, `blockchain.etherTokens['${account}']`, 0))

export const getGasPrice = state => (
  state.blockchain.gasPrice ? new Decimal(parseInt(state.blockchain.gasPrice, 10)) : new Decimal(0)
)

export const isGasPriceFetched = state => state.blockchain.gasPrice !== undefined

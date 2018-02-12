import Decimal from 'decimal.js'

/**
 * Returns if gnosis.js is initialized or not
 * @param {*} state - redux state
 */
export const isGnosisInitialized = state => state.blockchain.get('gnosisInitialized')

export const triedToConnect = state => state.blockchain.get('connectionTried')

export const getGasCosts = (state) => {
  const gasCosts = state.blockchain.get('gasCosts')

  return gasCosts.map((cost) => {
    if (!cost) {
      return 0
    }

    return cost
  })
}

export const isGasCostFetched = (state, property) => state.blockchain.getIn(['gasCosts', property]) !== undefined

export const getEtherTokensAmount = (state, account) => new Decimal(state.blockchain.getIn(['etherTokens', account], 0))

export const getGasPrice = state => new Decimal(state.blockchain.get('gasPrice').toString())

export const isGasPriceFetched = state => state.blockchain.get('gasPrice') !== undefined

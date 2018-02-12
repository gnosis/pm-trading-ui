import Decimal from 'decimal.js'

/**
 * Returns if gnosis.js is initialized or not
 * @param {*} state - redux state
 */
export const isGnosisInitialized = state => !!state.blockchain.get('gnosisInitialized')

export const triedToConnect = state => !!state.blockchain.get('connectionTried')

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

export const getEtherTokensAmount = (state, account) => {
  const etherTokensAmount = state.blockchain.getIn(['etherTokens', account], 0)
  let etherTokensDecimal
  try {
    etherTokensDecimal = Decimal(etherTokensAmount)
  } catch (e) {
    etherTokensDecimal = Decimal(0)
  }

  return etherTokensDecimal
}

export const getGasPrice = (state) => {
  const gasPrice = state.blockchain.get('gasPrice', 0)
  let gasPriceDecimal
  try {
    gasPriceDecimal = Decimal(gasPrice.toString())
  } catch (e) {
    gasPriceDecimal = Decimal(0)
  }

  return gasPriceDecimal
}

export const isGasPriceFetched = state => state.blockchain.get('gasPrice') !== undefined

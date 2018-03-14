import Decimal from 'decimal.js'

/**
 * Returns if gnosis.js is initialized or not
 * @param {*} state - redux state
 */
export const isGnosisInitialized = state => !!state.blockchain.get('gnosisInitialized')

export const triedToConnect = state => !!state.blockchain.get('connectionTried')

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

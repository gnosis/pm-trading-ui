import Decimal from 'decimal.js'

export const selector = state => state.blockchain

export const getDefaultAccount = state => selector(state).defaultAccount

export const getGasCosts = state => selector(state).gasCosts

export const getGasPrice = state => new Decimal(parseInt(selector(state).gasPrice, 10))

export default {
  getDefaultAccount,
}

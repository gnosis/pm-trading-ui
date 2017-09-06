import { get } from 'lodash'

export const selector = state => state.blockchain

export const getDefaultAccount = state => selector(state).defaultAccount

export const getGasCosts = state => state.blockchain.gasCost

export const getGasPrice = state => state.blockchain.gasPrice

export default {
  getDefaultAccount,
}

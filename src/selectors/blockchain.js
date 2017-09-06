export const selector = state => state.blockchain

export const getDefaultAccount = state => selector(state).defaultAccount

export const getGasCosts = state => selector(state).gasCosts

export const getGasPrice = state => selector(state).gasPrice

export default {
  getDefaultAccount,
}

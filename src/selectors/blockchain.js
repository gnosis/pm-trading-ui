import { get } from 'lodash'

export const selector = state => state.blockchain

export const getDefaultAccount = state => selector(state).defaultAccount

export const getContractInfo = state => (contractAddress) => get(selector(state), `contracts['${contractAddress}']`)

export default {
  getDefaultAccount,
}

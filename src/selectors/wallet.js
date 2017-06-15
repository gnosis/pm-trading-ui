import _ from 'lodash'

export const selector = state => state.wallet

export const activeWallet = state => _.get(selector(state), `providers[${selector(state).activeProvider}]`)

export default {
  activeWallet,
}

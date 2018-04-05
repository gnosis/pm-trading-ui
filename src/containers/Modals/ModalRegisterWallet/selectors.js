import { GAS_COST } from 'utils/constants'

const getRegistrationGasCost = (state) => {
  const gasCost = state.blockchain.getIn(['gasCosts', GAS_COST.MAINNET_ADDRESS_REGISTRATION], 0)

  return gasCost
}

export { getRegistrationGasCost }

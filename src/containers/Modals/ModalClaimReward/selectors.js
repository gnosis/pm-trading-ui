import { GAS_COST } from 'utils/constants'

const getClaimRewardGasCost = (state) => {
  const gasCost = state.blockchain.getIn(['gasCosts', GAS_COST.CLAIM_REWARD], 0)

  return gasCost
}

export { getClaimRewardGasCost }

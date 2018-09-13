import { GAS_COST } from 'utils/constants'
import { setGasCost } from 'routes/MarketDetails/store/actions'
import { getFeatureConfig } from 'utils/features'
import { calcClaimRewardGasCost } from './api'

const contractType = GAS_COST.CLAIM_REWARD
const { claimReward } = getFeatureConfig('rewardClaiming')

const requestClaimRewardGasCost = () => async (dispatch) => {
  const gasCost = await calcClaimRewardGasCost(claimReward.contractAddress)

  dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
}

export { requestClaimRewardGasCost }

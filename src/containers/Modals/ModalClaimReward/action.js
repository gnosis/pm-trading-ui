import { GAS_COST } from 'utils/constants'
import { setGasCost } from 'routes/MarketDetails/store/actions'
import { getFeatureConfig } from 'utils/features'
import { calcClaimRewardGasCost } from './api'

const contractType = GAS_COST.CLAIM_REWARD
const { rewardToken } = getFeatureConfig('rewards')

const requestClaimRewardGasCost = () => async (dispatch) => {
  const gasCost = await calcClaimRewardGasCost(rewardToken.address)

  dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
}

export { requestClaimRewardGasCost }

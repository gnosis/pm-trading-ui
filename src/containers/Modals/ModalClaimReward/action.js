import { GAS_COST } from 'utils/constants'
import { setGasCost } from 'routes/MarketDetails/store/actions'
import { getRewardClaimOptions } from 'utils/configuration'
import { calcClaimRewardGasCost } from './api'

const contractType = GAS_COST.CLAIM_REWARD
const { contractAddress } = getRewardClaimOptions()

const requestClaimRewardGasCost = () => async (dispatch) => {
  const gasCost = await calcClaimRewardGasCost(contractAddress)

  dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
}

export { requestClaimRewardGasCost }

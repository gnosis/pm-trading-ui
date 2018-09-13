import { claimRewards } from 'api'

import { setAccountRewardClaimState } from 'store/actions/account'
import { getCurrentAccount } from 'integrations/store/selectors'
import { getFeatureConfig } from 'utils/features'

const { claimUntil } = getFeatureConfig('rewards')

export const claimUserRewards = (contractAddress, rewardClaimAmount) => async (dispatch, getState) => {
  const state = getState()
  const account = getCurrentAccount(state)
  try {
    await claimRewards(contractAddress) // These arguments get hashed, this way we can determine if claiming is available again
    dispatch(setAccountRewardClaimState(account, claimUntil, rewardClaimAmount))
  } catch (e) {
    console.error(e)
  }
}

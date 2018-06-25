import { claimRewards } from 'api'

import { setAccountRewardClaimState } from 'store/actions/account'
import { getCurrentAccount } from 'integrations/store/selectors'

export const claimUserRewards = (
  contractAddress,
  rewardClaimUntil,
  rewardClaimAmount,
) => async (dispatch, getState) => {
  const state = getState()
  const account = getCurrentAccount(state)

  try {
    await claimRewards(contractAddress)

    // These arguments get hashed, this way we can determine if claiming is available again
    dispatch(setAccountRewardClaimState(account, rewardClaimUntil, rewardClaimAmount))
  } catch (e) {
    console.error(e)
  }
}

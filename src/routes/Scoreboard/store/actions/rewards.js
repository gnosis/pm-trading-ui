import { claimRewards } from 'api'
import { createAction } from 'redux-actions'

export const rewardsClaimed = createAction('REWARDS_CLAIMED')

export const claimUserRewards = contractAddress => async (dispatch) => {
  try {
    await claimRewards(contractAddress)
    dispatch(rewardsClaimed())
  } catch (e) {
    console.error(e)
  }
}

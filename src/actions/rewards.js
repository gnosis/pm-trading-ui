import { claimRewards } from 'api'

export const claimUserRewards = () => async () => {
  try {
    await claimRewards()
    localStorage.setItem('rewardsClaimed', true)
  } catch (e) {
    console.error(e)
  }
}

import { claimRewards } from 'api'

export const claimUserRewards = contractAddress => async () => {
  try {
    await claimRewards(contractAddress)
    localStorage.setItem('rewardsClaimed', true)
  } catch (e) {
    console.error(e)
  }
}

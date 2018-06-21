import { claimRewards } from 'api'

export const claimUserRewards = contractAddress => async () => {
  try {
    await claimRewards(contractAddress)
  } catch (e) {
    console.error(e)
  }
}

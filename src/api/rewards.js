import { getGnosisConnection } from 'api'

export const claimRewards = async (contractAddress) => {
  const gnosis = await getGnosisConnection()
  const rewardContract = await gnosis.contracts.RewardClaimHandler.at(contractAddress)

  await rewardContract.claimReward()
}

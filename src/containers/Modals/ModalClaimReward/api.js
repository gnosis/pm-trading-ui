import { getGnosisConnection } from 'api'

const calcClaimRewardGasCost = async (contractAddress) => {
  const gnosis = await getGnosisConnection()
  const rewardContract = await gnosis.contracts.RewardClaimHandler.at(contractAddress)
  const gasCost = await rewardContract.claimReward.estimateGas()
  return gasCost
}

export { calcClaimRewardGasCost }

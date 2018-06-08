import { getGnosisConnection } from 'api'

const calcClaimRewardGasCost = async (contractAddress) => {
  const gnosis = await getGnosisConnection()
  console.log(contractAddress)
  const rewardContract = await gnosis.contracts.RewardClaimHandler.at(contractAddress)
  window.contract = rewardContract
  const gasCost = await rewardContract.claimReward.estimateGas.call()
  return gasCost
}

export { calcClaimRewardGasCost }

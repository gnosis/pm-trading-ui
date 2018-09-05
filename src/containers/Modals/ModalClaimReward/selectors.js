import { GAS_COST } from 'utils/constants'
import { rankSelector } from 'routes/Scoreboard/store/selectors'
import { createSelector } from 'reselect'
import { getFeatureConfig } from 'utils/features'
import { getCurrentAccount } from 'integrations/store/selectors'
import sha1 from 'sha1'

const { levels, claimUntil } = getFeatureConfig('rewards')

export const getClaimRewardGasCost = (state) => {
  const gasCost = state.blockchain.getIn(['gasCosts', GAS_COST.CLAIM_REWARD], 0)

  return gasCost
}

export const getRewardValue = createSelector(rankSelector, (rank) => {
  let rewardValue = 0

  levels.forEach((rewardLevel) => {
    if (
      (rank >= rewardLevel.minRank && rank <= rewardLevel.maxRank) // between min/max
      || (rank >= rewardLevel.minRank && rewardLevel.maxRank == null) // above min
    ) {
      rewardValue = rewardLevel.value
    }
  })

  return rewardValue
})

export const hasClaimedReward = (state) => {
  const rewardValue = getRewardValue(state)
  const account = getCurrentAccount(state)
  const currentRewardClaimHash = sha1(`${claimUntil}${rewardValue}`)

  return state.integrations.getIn(['accountSettings', account, 'rewardClaimHash']) === currentRewardClaimHash
}

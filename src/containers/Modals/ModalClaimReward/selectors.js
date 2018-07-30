import { GAS_COST } from 'utils/constants'
import { rankSelector } from 'routes/Scoreboard/store/selectors'
import { createSelector } from 'reselect'
import { getFeatureConfig } from 'utils/features'

const { levels } = getFeatureConfig('rewards')

const getClaimRewardGasCost = (state) => {
  const gasCost = state.blockchain.getIn(['gasCosts', GAS_COST.CLAIM_REWARD], 0)

  return gasCost
}

export const getRewardValue = createSelector(rankSelector, (rank) => {
  let rewardValue = 0

  levels.forEach((rewardLevel) => {
    if (
      (rank >= rewardLevel.minRank && rank <= rewardLevel.maxRank) || // between min/max
      (rank >= rewardLevel.minRank && rewardLevel.maxRank == null) // above min
    ) {
      rewardValue = rewardLevel.value
    }
  })

  return rewardValue
})

export { getClaimRewardGasCost }

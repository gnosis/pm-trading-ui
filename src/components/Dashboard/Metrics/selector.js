import Decimal from 'decimal.js'
import { createSelector, createStructuredSelector } from 'reselect'
import { getCurrentBalance } from 'selectors/blockchain'
import { meSelector } from 'routes/Scoreboard/store/selectors'
import { badgeOf } from 'routes/Scoreboard/components/ScoreTable/table'

const tokenSelector = createSelector(
  getCurrentBalance,
  balance => (balance || '0'),
)

const profitsSelector = createSelector(
  meSelector,
  account => (account ? Decimal(account.predictedProfit).div(1e18).toDP(2, 1).toString() : undefined),
)

const rankSelector = createSelector(
  meSelector,
  account => (account ? account.currentRank : undefined),
)

const badgeSelector = createSelector(
  meSelector,
  account => badgeOf(account ? account.predictions : undefined),
)


export default createStructuredSelector({
  tokens: tokenSelector,
  predictedProfit: profitsSelector,
  rank: rankSelector,
  badge: badgeSelector,
})

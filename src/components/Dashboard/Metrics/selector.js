import { values } from 'lodash'
import Decimal from 'decimal.js'
import { createSelector, createStructuredSelector } from 'reselect'
import { getCurrentBalance } from 'selectors/blockchain'
import { getAccountShares } from 'selectors/marketShares'
import { meSelector } from 'routes/scoreboard/store/selectors'
import { badgeOf } from 'routes/scoreboard/components/ScoreTable/table'

const tokenSelector = createSelector(
  getCurrentBalance,
  balance => (balance || '0'),
)

const profitsSelector = createSelector(
  meSelector,
  getAccountShares,
  (account, accountShares) => {
    const minProfit = Decimal(0)

    if (!account) {
      return minProfit
    }

    const shares = values(accountShares)
    return shares.length
      ? shares.reduce(
        (assets, share) => assets.add(new Decimal(share.balance).mul(share.marginalPrice)),
        minProfit,
      )
      : minProfit
  },
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

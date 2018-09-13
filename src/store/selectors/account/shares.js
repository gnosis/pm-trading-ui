import { List } from 'immutable'
import { createSelector } from 'reselect'
import Decimal from 'decimal.js'
import { getCollateralToken } from 'store/selectors/blockchain'
import { normalizeHex } from 'utils/helpers'
import { calcShareWinnings } from 'routes/Dashboard/containers/Dashboard/utils'

export const sharesWithMarketsSelector = createSelector(
  state => state.marketList,
  state => state.accountShares,
  (marketList, marketShares) => marketShares.map((marketShare) => {
    const sharesMarket = marketList.find(
      market => normalizeHex(market.eventAddress) === normalizeHex(marketShare.eventAddress),
    )
    return marketShare.set('market', sharesMarket)
  }),
)

const shareSelector = createSelector(sharesWithMarketsSelector, getCollateralToken, (shares, collateralToken) => List(
  shares
    .filter(
      share => Decimal(share.balance).gt(0)
          && typeof share.market !== 'undefined'
          && normalizeHex(share.collateralTokenAddress) === normalizeHex(collateralToken.address),
    )
    .map((share) => {
      let shareWinnings = '0'

      if (share.market.resolved) {
        shareWinnings = calcShareWinnings(share, share.market)
      }

      return share.set('winnings', shareWinnings)
    })
    .sortBy(share => share.marketResolution, (dateA, dateB) => (dateA.isBefore(dateB) ? -1 : 1))
    .values(),
))

export default shareSelector

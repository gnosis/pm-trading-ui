import { List } from 'immutable'
import { createSelector } from 'reselect'
import Decimal from 'decimal.js'
import { getCollateralToken } from 'store/selectors/blockchain'
import { normalizeHex } from 'utils/helpers'

const sharesWithMarketsSelector = createSelector(
  state => state.marketList,
  state => state.marketShares,
  (marketList, marketShares) => (
    marketShares.map((marketShare) => {
      const sharesMarket = marketList.find(market => normalizeHex(market.eventAddress) === normalizeHex(marketShare.eventAddress))
      return marketShare.set('market', sharesMarket)
    })
  ),
)

const shareSelector = createSelector(
  sharesWithMarketsSelector,
  getCollateralToken,
  (shares, collateralToken) => List(shares
    .filter(share => (
      Decimal(share.balance).gt(0) &&
      typeof share.market !== 'undefined' &&
      normalizeHex(share.collateralTokenAddress) === normalizeHex(collateralToken.address)
    ))
    .sortBy(share => share.marketResolution, (dateA, dateB) => (dateA.isBefore(dateB) ? -1 : 1)).values()),
)

export default shareSelector

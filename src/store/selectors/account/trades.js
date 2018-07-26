import { List } from 'immutable'
import { createSelector } from 'reselect'
import { getCollateralToken } from 'store/selectors/blockchain'
import { normalizeHex } from 'utils/helpers'

const tradesWithMarketsSelector = createSelector(
  state => state.marketList,
  state => state.accountTrades,
  (marketList, marketTrades) => marketTrades.map((marketTrade) => {
    const tradesMarket = marketList.find(
      market => normalizeHex(market.eventAddress) === normalizeHex(marketTrade.eventAddress),
    )
    return marketTrade.set('market', tradesMarket)
  }),
)

const tradeSelector = createSelector(tradesWithMarketsSelector, getCollateralToken, (trades, collateralToken) => List(
  trades
    .filter(trade => typeof trade.market !== 'undefined' && trade.collateralTokenAddress === collateralToken.address)
    .sortBy(trade => trade.date, (dateA, dateB) => (dateA.isBefore(dateB) ? 1 : -1))
    .values(),
))

export default tradeSelector

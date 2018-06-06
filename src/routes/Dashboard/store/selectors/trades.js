import { List } from 'immutable'
import { createSelector } from 'reselect'
import Decimal from 'decimal.js'
import { getCollateralToken } from 'store/selectors/blockchain'

const tradesWithMarketsSelector = createSelector(
  state => state.marketList,
  state => state.marketTrades,
  (marketList, marketTrades) => (
    marketTrades.map((marketTrade) => {
      const tradesMarket = marketList.find(market => market.eventAddress === marketTrade.eventAddress)
      if (!tradesMarket) {
        console.log('no market for', marketTrade)
      }
      return marketTrade.set('market', tradesMarket)
    })
  ),
)
const tradeSelector = createSelector(
  tradesWithMarketsSelector,
  getCollateralToken,
  (trades, collateralToken) => List(trades
    .filter(trade => (
      typeof trade.market !== 'undefined' &&
      trade.collateralTokenAddress === collateralToken.address
    ))
    .sortBy(trade => trade.date).values()),
)

export default tradeSelector

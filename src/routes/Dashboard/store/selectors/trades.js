import { List } from 'immutable'
import { createSelector } from 'reselect'
import Decimal from 'decimal.js'

const tradeSelector = createSelector(
  state => state.marketTrades,
  trades => List(trades
    .filter(trade => Decimal(trade.price).gt(0))
    .sortBy(trade => trade.date).values()),
)

export default tradeSelector

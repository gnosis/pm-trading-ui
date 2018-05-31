import { Record } from 'immutable'

export const ORDER_TYPE_BUY = 'BUY'
export const ORDER_TYPE_SELL = 'SELL'

const TradeRecord = Record({
  id: undefined, // string
  date: undefined, // moment
  owner: undefined, // string
  price: undefined, // string (Decimal)
  orderType: undefined, // string oneOf 'BUY', 'SELL'
  marketTitle: undefined, // string
  marketResolution: undefined, // moment
  marketOutcomes: undefined, // List<Outcome>
  marginalPrices: undefined, // List<decimal>
  outcomeToken: undefined, // OutcomeRecord
}, 'Trade')

export default TradeRecord

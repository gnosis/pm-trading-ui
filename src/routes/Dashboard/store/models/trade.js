import { Record } from 'immutable'

const TradeRecord = Record({
  id: undefined, // string
  date: undefined, // moment
  owner: undefined, // string
  cost: undefined, // int
  profit: undefined, // int
  orderType: undefined, // string oneOf 'BUY', 'SELL'
  marketTitle: undefined, // string
  marketDescription: undefined, // string
  marketResolution: undefined, // moment
  marketOutcomes: undefined, // List<Outcome>
  marginalPrices: undefined, // List<decimal>
  outcomeToken: undefined, // OutcomeRecord
}, 'Trade')

export default TradeRecord

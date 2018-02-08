import { Record } from 'immutable'

export const MARKET_SCALAR = 'SCALAR'
export const MARKET_CATEGORICAL = 'CATEGORICAL'

const MarketRecord = Record({
  title: undefined, // string
  date: undefined, // ts
  volume: undefined, // decimal
  type: undefined, // enum {CATEGORICAL, SCALAR}
  outcomes: undefined, // List<Outcome>
  bounds: undefined, // BoundRecord
}, 'Market')

export default MarketRecord

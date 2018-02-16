import { Record } from 'immutable'

export const MARKET_SCALAR = 'SCALAR'
export const MARKET_CATEGORICAL = 'CATEGORICAL'

export const MARKET_STAGES = {
  MARKET_CREATED: 0,
  MARKET_FUNDED: 1,
  MARKET_CLOSED: 2,
}

const MarketRecord = Record({
  title: undefined, // string
  date: undefined, // ts
  volume: undefined, // decimal
  stage: undefined,
  type: undefined, // enum {CATEGORICAL, SCALAR}
  outcomes: undefined, // List<Outcome>
  bounds: undefined, // BoundRecord
}, 'Market')

export default MarketRecord

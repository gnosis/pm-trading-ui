import { Record } from 'immutable'

export const MARKET_SCALAR = 'SCALAR'
export const MARKET_CATEGORICAL = 'CATEGORICAL'

export const MARKET_STAGES = {
  MARKET_CREATED: 0,
  MARKET_FUNDED: 1,
  MARKET_CLOSED: 2,
}

export const BoundsRecord = Record({
  lower: undefined,
  upper: undefined,
  unit: undefined,
}, 'Bound')

export const OutcomeRecord = Record({
  name: undefined, // string
  marginalPrice: undefined, // decimal
}, 'Outcome')

const MarketRecord = Record({
  title: undefined, // string
  resolution: undefined, // moment
  volume: undefined, // decimal
  type: undefined, // enum {CATEGORICAL, SCALAR}
  outcomes: undefined, // List<Outcome>
  bounds: undefined, // BoundRecord
  // Proerties needed for selectors filtering markets
  creation: undefined, // moment
  stage: undefined,
  resolved: undefined, // boolean
}, 'Market')

export default MarketRecord

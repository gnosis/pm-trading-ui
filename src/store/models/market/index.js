import { Record } from 'immutable'

export const MARKET_STAGES = {
  MARKET_CREATED: 0,
  MARKET_FUNDED: 1,
  MARKET_CLOSED: 2,
}

export const BoundsRecord = Record({
  lower: undefined,
  upper: undefined,
  unit: undefined,
  decimals: undefined,
}, 'Bound')

export const OutcomeRecord = Record({
  name: undefined, // string
  marginalPrice: undefined, // decimal
  outcomeTokensSold: undefined, // int
}, 'Outcome')

export { default as ScalarMarketRecord } from './scalar'
export { default as CategoricalMarketRecord } from './categorical'

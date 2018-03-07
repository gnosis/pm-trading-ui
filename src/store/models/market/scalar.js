import { Record } from 'immutable'
import { OUTCOME_TYPES } from 'utils/constants'

const ScalarMarketRecord = Record({
  type: OUTCOME_TYPES.CATEGORICAL,
  address: undefined,
  title: undefined, // string
  resolution: undefined, // moment
  volume: undefined, // decimal
  outcomes: undefined, // List<Outcome>
  winningOutcome: undefined, // int
  bounds: undefined, // BoundRecord
  funding: undefined, // int
  creation: undefined, // moment
  stage: undefined, // int
  resolved: undefined, // boolean
  creator: undefined, // string
  collateralToken: undefined, // string
  outcomeTokensSold: undefined, // int
}, 'Market')

export default ScalarMarketRecord

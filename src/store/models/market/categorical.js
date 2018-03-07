import { Record } from 'immutable'
import { OUTCOME_TYPES } from 'utils/constants'

const CategoricalMarketRecord = Record({
  type: OUTCOME_TYPES.CATEGORICAL,
  address: undefined,
  title: undefined, // string
  resolution: undefined, // moment
  volume: undefined, // decimal
  outcomes: undefined, // List<Outcome>
  winningOutcome: undefined, // OutcomeRecord
  funding: undefined, // int
  creation: undefined, // moment
  stage: undefined,
  resolved: undefined, // boolean
  creator: undefined, // string
  collateralToken: undefined, // string
  outcomeTokensSold: undefined, // List<int>
}, 'Market')

export default CategoricalMarketRecord

import { Record } from 'immutable'
import { OUTCOME_TYPES } from 'utils/constants'

const CategoricalMarketRecord = Record({
  type: OUTCOME_TYPES.CATEGORICAL,
  address: undefined,
  title: undefined, // string
  description: undefined, // string
  resolution: undefined, // moment
  volume: undefined, // decimal
  outcomes: undefined, // List<Outcome>
  eventAddress: undefined, // string
  winningOutcome: undefined, // OutcomeRecord
  funding: undefined, // int
  creation: undefined, // moment
  stage: undefined,
  fee: undefined, // int
  resolved: undefined, // boolean
  closed: undefined, // boolean
  creator: undefined, // string
  collateralToken: undefined, // string
  outcomeTokensSold: undefined, // List<int>
}, 'Market')

export default CategoricalMarketRecord

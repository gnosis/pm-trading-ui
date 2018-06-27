import { Record } from 'immutable'

const ShareRecord = Record({
  id: undefined, // string
  owner: undefined, // string
  eventAddress: undefined, // string
  collateralTokenAddress: undefined, // string
  balance: undefined, // int
  marketTitle: undefined, // string
  marketType: undefined, // oneOf OUTCOME_TYPE
  marketResolution: undefined, // moment
  marketOutcomes: undefined, // List<Outcome>
  marginalPrice: undefined, // decimal
  outcomeToken: undefined, // OutcomeRecord
  market: undefined, // MarketRecord
}, 'Share')

export default ShareRecord

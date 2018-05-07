import { Record } from 'immutable'

const ShareRecord = Record({
  id: undefined, // string
  owner: undefined, // string
  balance: undefined, // int
  marketTitle: undefined, // string
  marketDescription: undefined, // string
  marketResolution: undefined, // moment
  marketOutcomes: undefined, // List<Outcome>
  marginalPrice: undefined, // decimal
  outcomeToken: undefined, // OutcomeRecord
}, 'Share')

export default ShareRecord

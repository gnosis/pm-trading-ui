import { Record } from 'immutable'

const Market = Record({
  title: undefined, // string
  date: undefined, // ts
  volume: undefined, // decimal
  type: undefined, // enum {CATEGORICAL, SCALAR}
  outcomes: undefined, // List<Outcome>
  bounds: undefined, // BoundRecord
}, 'Market')

export default Market

import { Record } from 'immutable'

const OutcomeRecord = Record({
  name: undefined, // string
  marginalPrice: undefined, // decimal
}, 'Outcome')

export default OutcomeRecord

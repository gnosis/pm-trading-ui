import { Record } from 'immutable'

const Outcome = Record({
  name: undefined, // string
  marginalPrice: undefined, // decimal
}, 'Outcome')

export default Outcome

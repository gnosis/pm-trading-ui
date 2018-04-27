import { Record, List } from 'immutable'

const txRecord = Record(
  {
    id: undefined,
    label: '',
    events: List(),
    startTime: undefined,
  },
  'Transaction',
)

export default txRecord

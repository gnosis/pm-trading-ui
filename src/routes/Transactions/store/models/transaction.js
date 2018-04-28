import { Record, List } from 'immutable'

const TxRecord = Record(
  {
    id: undefined,
    label: '',
    events: List(),
    startTime: undefined,
    progress: undefined,
  },
  'Transaction',
)

export default TxRecord

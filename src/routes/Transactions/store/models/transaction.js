import { Record, List } from 'immutable'

const TxRecord = Record(
  {
    id: undefined,
    label: '',
    events: List(),
    startTime: undefined,
    progress: undefined,
    endTime: undefined,
    completed: undefined,
    completionStatus: undefined,
  },
  'Transaction',
)

export default TxRecord

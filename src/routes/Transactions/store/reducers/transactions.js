import { handleActions } from 'redux-actions'
import { get } from 'lodash'
import { Map } from 'immutable'
import {
  startTransactionLog,
  closeTransactionLog,
  showTransactionLog,
  hideTransactionLog,
  addTransactionLogEntry,
} from 'routes/Transactions/store/actions/transactions'
import TxRecord from 'routes/Transactions/store/models/transaction'

const LOAD_LOCALSTORAGE = 'LOAD_LOCALSTORAGE'

const reducer = handleActions(
  {
    [startTransactionLog]: (state, { payload }) => state.setIn(['log', payload.id], new TxRecord(payload)),
    [closeTransactionLog]: (state, { payload }) => state.mergeIn(['log', payload.id], payload),
    [addTransactionLogEntry]: (state, { payload: { id, ...transactionLog } }) =>
      state.updateIn(['log', id, 'events'], events =>
        events.map(log =>
          (log.event === transactionLog.event
            ? {
              ...log,
              ...transactionLog,
            }
            : log))),
    [showTransactionLog]: state => state.set('visible', true),
    [hideTransactionLog]: state => state.set('visible', false),
    [LOAD_LOCALSTORAGE]: (state, action) => {
      const newState = {
        ...state,
        log: {},
      }

      const savedLogs = get(action, 'payload.transactions.log', {})
      const logs = Object.keys(savedLogs).forEach((id) => {
        const log = savedLogs[id]

        if (log.completed) {
          newState.log[id] = log
        } else {
          newState.log[id] = {
            ...log,
            completed: true,
            completionStatus: 'LOST',
          }
        }
      })

      return newState
    },
  },
  Map({
    log: Map(),
    visible: false,
  }),
)

export default reducer

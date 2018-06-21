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
import { LOAD_LOCALSTORAGE } from 'store/middlewares/Storage'

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
    [LOAD_LOCALSTORAGE]: (state, action) =>
      state.withMutations((stateMap) => {
        console.log('loading storage')
        const savedLogs = get(action, 'payload.transactions.log', {})
        Object.keys(savedLogs).forEach((id) => {
          let log = { ...savedLogs[id] }

          if (!log.completed) {
            log = {
              ...log,
              completed: true,
              completionStatus: 'LOST',
            }
          }

          stateMap.setIn(['log', id], new TxRecord(log))
        })
      }),
  },
  Map({
    log: Map(),
    visible: false,
  }),
)

export default reducer

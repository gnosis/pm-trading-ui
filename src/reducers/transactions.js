import { handleActions } from 'redux-actions'

import {
  TRANSACTION_STATUS,
  TRANSACTION_COMPLETE_STATUS,
} from 'utils/constants'

import {
  startTransactionLog,
  closeTransactionLog,
  addTransactionLogEntry,
} from 'actions/transactions'

const reducer = handleActions({
  [startTransactionLog]: (state, action) => ({
    ...state,
    [action.payload.id]: {
      ...action.payload,
      events: action.payload.events.map((event) => {
        if (!event.status) {
          return {
            ...event,
            status: TRANSACTION_STATUS.RUNNING,
          }
        }
        return event
      }),
    },
  }),
  [closeTransactionLog]: (state, action) => ({
    ...state,
    [action.payload.id]: {
      completed: true,
      completionStatus: action.payload.completionStatus || TRANSACTION_COMPLETE_STATUS.NO_ERROR,
      ...state[action.payload.id],
    },
  }),
  [addTransactionLogEntry]: (state, action) => {
    const { id, ...transactionLog } = action.payload

    return {
      ...state,
      [id]: {
        ...state[id],
        events: state[id].events.map((log) => {
          if (log.event === transactionLog.event) {
            return {
              ...log,
              ...transactionLog,
            }
          }

          return log
        }),
      },
    }
  },
}, {})


export default reducer

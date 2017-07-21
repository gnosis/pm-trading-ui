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
  [addTransactionLogEntry]: (state, action) => ({
    ...state,
    [action.payload.id]: {
      ...state[action.payload.id],
      events: state[action.payload.id].events.map((event) => {
        if (event.event === action.payload.event) {
          return {
            ...event,
            ...action.payload,
          }
        }

        return event
      }),
    },
  }),
}, {})


export default reducer

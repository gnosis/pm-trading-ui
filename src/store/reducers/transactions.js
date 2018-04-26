import { handleActions } from 'redux-actions'
import { get } from 'lodash'
import { TRANSACTION_STATUS } from 'utils/constants'
import {
  startTransactionLog,
  closeTransactionLog,
  showTransactionLog,
  hideTransactionLog,
  addTransactionLogEntry,
} from 'store/actions//transactions'

const LOAD_LOCALSTORAGE = 'LOAD_LOCALSTORAGE'

const reducer = handleActions(
  {
    [startTransactionLog]: (state, action) => ({
      ...state,
      log: {
        ...state.log,
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
      },
    }),
    [closeTransactionLog]: (state, action) => {
      const { id, ...payload } = action.payload
      return {
        ...state,
        log: {
          ...state.log,
          [id]: {
            ...state.log[id],
            ...payload,
          },
        },
      }
    },
    [addTransactionLogEntry]: (state, action) => {
      const { id, ...transactionLog } = action.payload

      return {
        ...state,
        log: {
          ...state.log,
          [id]: {
            ...state.log[id],
            events: state.log[id].events.map((log) => {
              if (log.event === transactionLog.event) {
                return {
                  ...log,
                  ...transactionLog,
                }
              }

              return log
            }),
          },
        },
      }
    },
    [showTransactionLog]: state => ({
      ...state,
      visible: true,
    }),
    [hideTransactionLog]: state => ({
      ...state,
      visible: false,
    }),
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
  { log: {}, visible: false },
)

export default reducer

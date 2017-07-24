import _ from 'lodash'

import { TRANSACTION_STATUS, TRANSACTION_COMPLETE_STATUS } from 'utils/constants'

export const transactionSelector = (state, transactionId) => _.get(state, `transactions['${transactionId}']`, {})
export const getTransactionProgress = (state, transactionId) => {
  const transaction = transactionSelector(state, transactionId)
  if (transaction) {
    const events = _.get(transaction, 'events', [])

    if (events.length > 0) {
      const doneEvents = events.reduce((acc, event) => {
        if (event.status === TRANSACTION_STATUS.DONE) {
          return acc + 1
        }

        return acc
      }, 0)

      return doneEvents / events.length
    }
  }

  return 0
}

export const getTransactionLogs = (state, transactionId) => {
  const transaction = transactionSelector(state, transactionId)

  if (transaction) {
    const events = _.get(transaction, 'events', [])

    if (events.length > 0) {
      return events.map(event => ({
        ...event,
        isDone: event.status === TRANSACTION_STATUS.DONE,
      }))
    }
  }

  return []
}

export const getTransactionComplete = (state, transactionId) => {
  const transaction = transactionSelector(state, transactionId)

  return transaction && transaction.completed && transaction.completionStatus === TRANSACTION_COMPLETE_STATUS.NO_ERROR
}

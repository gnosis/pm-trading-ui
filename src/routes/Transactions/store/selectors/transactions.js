import _ from 'lodash'

import { TRANSACTION_STATUS, TRANSACTION_COMPLETE_STATUS } from 'utils/constants'

export const transactionSelector = (state, transactionId) => {
  if (!transactionId) {
    throw new Error('suka blat')
  }
  console.log(transactionId)
  return state.transactions.getIn(['log', transactionId], {})
}

export const getTransactionProgress = (state, transactionId) => {
  const transaction = transactionSelector(state, transactionId)
  console.log(transaction)
  if (transaction) {
    const events = transaction.get ? transaction.get('events', []) : []

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
  console.log(transaction)
  if (transaction) {
    const events = transaction.get('events', [])

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

  return transaction && transaction.completed
}

export const didTransactionFail = (state, transactionId) => {
  const transaction = transactionSelector(state, transactionId)

  return transaction && transaction.completed && transaction.completionStatus === TRANSACTION_COMPLETE_STATUS.ERROR
}

export const didTransactionSucceed = (state, transactionId) => {
  const transaction = transactionSelector(state, transactionId)

  return transaction && transaction.completed && transaction.completionStatus === TRANSACTION_COMPLETE_STATUS.NO_ERROR
}

export const getAllTransactions = state =>
  state.transactions.get('log', {}).map(tx => tx.set('progress', getTransactionProgress(state, tx.id)))

export const getRunningTransactions = state => getAllTransactions(state).filter(transaction => !transaction.completed)

export const getCompletedTransactions = state => getAllTransactions(state).filter(transaction => transaction.completed)

export const getRunningTransactionsProgress = (state) => {
  const transactions = getRunningTransactions(state)

  const doneEvents = transactions.reduce((acc, transaction) => {
    console.log(transaction)
    return acc + getTransactionProgress(state, transaction.id)
  }, 0)

  const totalEvents = transactions.reduce((acc, transaction) => acc + transaction.events.length, 0)

  return doneEvents / totalEvents
}

export const areLogsVisible = state => state.transactions.get('visible')

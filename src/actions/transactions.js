import { createAction } from 'redux-actions'
import uuid from 'uuid/v4'

export const startTransactionLog = createAction('START_TRANSACTION_LOG')
export const closeTransactionLog = createAction('CLOSE_TRANSACTION_LOG')
export const addTransactionLogEntry = createAction('ADD_TRANSACTION_LOG_ENTRY')

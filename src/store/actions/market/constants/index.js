import { TRANSACTION_STATUS } from 'utils/constants'

/**
 * Constant names for marketcreation stages
 * @readonly
 * @enum {string}
 */
export const TRANSACTION_STAGES = {
  GENERIC: 'generic',
}

/**
 * Generic Stage for single-event transactions
 */
export const TRANSACTION_EVENTS_GENERIC = [
  {
    event: TRANSACTION_STAGES.GENERIC,
    label: 'Sending Transaction',
    status: TRANSACTION_STATUS.RUNNING,
  },
]

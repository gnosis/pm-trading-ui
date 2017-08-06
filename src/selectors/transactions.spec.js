import { transactionSelector } from 'selectors/transactions'

const TRANSACTION_STATUS = require('utils/constants').TRANSACTION_STATUS
const TRANSACTION_COMPLETE_STATUS = require('utils/constants').TRANSACTION_COMPLETE_STATUS

describe('transactionsSelector', () => {
  test('it should return a transaction object', () => {
    const state = {
      transactions: {
        test123: {
          id: 'test123',
        },
      },
    }
    
    expect(transactionSelector(state, 'test123')).toMatchObject(state.transactions.test123)
  })

  test('it should return an empty object for an invalid transaction id', () => {
    const state = {
      transactions: {
        test123: {
          id: 'test123',
        },
      },
    }
    
    expect(transactionSelector(state, 'test123')).toMatchObject({})
  })
})

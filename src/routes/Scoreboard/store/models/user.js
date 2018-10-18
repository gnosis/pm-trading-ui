import { Record } from 'immutable'

const UserRecord = Record(
  {
    currentRank: undefined,
    diffRank: undefined,
    pastRank: undefined,
    account: undefined,
    balance: undefined,
    score: 0,
    predictedProfit: 0,
    predictions: 0,
  },
  'User',
)

export default UserRecord

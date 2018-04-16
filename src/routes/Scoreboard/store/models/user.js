import { Record } from 'immutable'

const UserRecord = Record(
  {
    currentRank: undefined,
    diffRank: undefined,
    pastRank: undefined,
    account: undefined,
    score: undefined,
    balance: undefined,
    predictedProfit: undefined,
    predictions: undefined,
  },
  'User',
)

export default UserRecord

import { getGnosisConnection } from 'api/gnosis'

const buySharesTransactions = [
  'We will ask you to approve the allowance transaction',
  'We will ask you to deposit ether in this market to invest in it',
  'We will ask you to approve a transaction of outcome tokens',
]

/**
 * Calculates the amount user is allowed to transact to concrete market
 * @param {string} userAddress - Market address
 * @param {string} marketAddress - User address
 * @returns {Decimal.js} Decimal.js object with the amount
 */
export const calculateAllowance = async (userAddress, marketAddress) => {
  const gnosis = await getGnosisConnection()
  const allowance = await gnosis.etherToken.allowance(userAddress, marketAddress)

  return allowance
}

export const getBuySharesTransactions = () => buySharesTransactions

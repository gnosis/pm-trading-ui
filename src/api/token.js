import { getGnosisConnection } from 'api'

export const getTokenSymbol = async (tokenAddress) => {
  const gnosis = await getGnosisConnection()
  const token = await gnosis.contracts.HumanFriendlyToken.at(tokenAddress)
  const tokenSymbol = await token.symbol()
  return tokenSymbol
}

export const getTokenBalance = async (tokenAddress, accountAddress) => {
  const gnosis = await getGnosisConnection()
  const token = await gnosis.contracts.Token.at(tokenAddress)
  const balance = await token.balanceOf(accountAddress)
  return balance
}

import { getGnosisConnection } from 'api'

/*
* Gas Calculation functions
*/

export const calcBuySharesGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.buyOutcomeTokens.estimateGas({ using: 'stats' })
  return gasCost
}

export const calcSellSharesGasCost = async () => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.sellOutcomeTokens.estimateGas({ using: 'stats' })
  return gasCost
}

/**
 * Returns gas cost for redeem winnings
 * @param {*object} opts options
 * @param {*string} opts.eventAddress Address for the event
 */

export const calcRedeemWinningsGasCost = async ({ eventAddress }) => {
  if (!eventAddress) {
    return undefined
  }

  const gnosis = await getGnosisConnection()
  const event = await gnosis.contracts.Event.at(eventAddress)

  const gasGost = await event.redeemWinnings.estimateGas()
  return gasGost
}

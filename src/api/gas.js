import * as api from './'

/*
* Gas Calculation functions
*/
export const calcFundingGasCost = async () => {
  const gnosis = await api.getGnosisConnection()
  return gnosis.contracts.Market.gasStats.fund.averageGasUsed
}

export const calcCategoricalEventGasCost = async () => {
  const gnosis = await api.getGnosisConnection()
  const gasCost = await gnosis.createCategoricalEvent.estimateGas({ using: 'stats' })
  return gasCost
}

export const calcScalarEventGasCost = async () => {
  const gnosis = await api.getGnosisConnection()
  const gasCost = await gnosis.createScalarEvent.estimateGas({ using: 'stats' })
  return gasCost
}

export const calcCentralizedOracleGasCost = async () => {
  const gnosis = await api.getGnosisConnection()
  const gasCost = await gnosis.createCentralizedOracle.estimateGas({ using: 'stats' })
  return gasCost
}

export const calcMarketGasCost = async () => {
  const gnosis = await api.getGnosisConnection()
  const gasCost = await gnosis.createMarket.estimateGas({ using: 'stats' })
  return gasCost
}

export const calcBuySharesGasCost = async () => {
  const gnosis = await api.getGnosisConnection()
  const gasCost = await gnosis.buyOutcomeTokens.estimateGas({ using: 'stats' })
  return gasCost
}

export const calcSellSharesGasCost = async () => {
  const gnosis = await api.getGnosisConnection()
  const gasCost = await gnosis.sellOutcomeTokens.estimateGas({ using: 'stats' })
  return gasCost
}

/**
 * Returns gas cost for redeem winnings
 * @param {*object} opts options
 * @param {*string} opts.eventAddress Address for the event
 */

export const calcRedeemWinningsGasCost = async (opts) => {
  const { eventAddress } = opts
  if (!eventAddress) {
    return undefined
  }

  const gnosis = await api.getGnosisConnection()
  const event = await gnosis.contracts.Event.at(eventAddress)

  const gasGost = await event.redeemWinnings.estimateGas()
  return gasGost
}

/**
 * Returns the current gas price
 */
export const getGasPrice = async () => {
  const gnosis = await api.getGnosisConnection()
  const gasPrice = await new Promise((resolve, reject) =>
    gnosis.web3.eth.getGasPrice((e, r) => (e ? reject(e) : resolve(r))))
  return gasPrice
}

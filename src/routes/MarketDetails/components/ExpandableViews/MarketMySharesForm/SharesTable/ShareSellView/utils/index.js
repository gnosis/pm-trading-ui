import { calcLMSRMarginalPrice, calcLMSRProfit } from 'api'
import Decimal from 'decimal.js'
import { weiToEth } from 'utils/helpers'
import { OUTCOME_TYPES, LIMIT_MARGIN } from 'utils/constants'
import { NUMBER_REGEXP } from 'routes/MarketDetails/components/ExpandableViews/MarketBuySharesForm'

/**
 * @function
 * Returns current probability for an outcome
 * @param {Object} market - The market you need to calculate probability for
 * @param {Object} [share] - User's share, needed only for categorical markets
 * @returns {Decimal}
 */
const calculateCurrentProbability = (market, share) => {
  // We can calculate probability for scalar markets without a share
  const categoricalMarketWithoutShare = !share && market.event && market.event.type === OUTCOME_TYPES.CATEGORCAL
  if (!market || categoricalMarketWithoutShare) {
    return new Decimal(0)
  }

  const { event: { type } } = market
  let currentProbability = new Decimal(0)

  // When calculating for SCALAR markets, we need to always calculate for long outcome
  // For categorical we should calculate for share's outcome
  const outcomeTokenIndex = type === OUTCOME_TYPES.SCALAR ? 1 : share.outcomeToken.index

  try {
    currentProbability = calcLMSRMarginalPrice({
      netOutcomeTokensSold: market.netOutcomeTokensSold.slice(),
      funding: market.funding,
      outcomeTokenIndex,
    })
  } catch (e) {
    console.error(e)
  }

  return currentProbability
}

/**
 * Calculates earnings for selected to sell share
 * @param {Object} market
 * @param {Object} share
 * @param {string|sumber|Decimal} selectedSellAmount - Amount to sell in wei
 * @returns {Decimal}
 */
const calculateEarnings = (market, share, selectedSellAmount) => {
  if (!market || !share || !selectedSellAmount) {
    return new Decimal(0)
  }

  let earnings = new Decimal(0)
  if (share.balance && NUMBER_REGEXP.test(selectedSellAmount) && parseFloat(selectedSellAmount) > 0) {
    earnings = weiToEth(calcLMSRProfit({
      netOutcomeTokensSold: market.netOutcomeTokensSold.slice(),
      funding: market.funding,
      outcomeTokenIndex: share.outcomeToken.index,
      outcomeTokenCount: selectedSellAmount,
      feeFactor: market.fee,
    })
      .mul(new Decimal(100).sub(LIMIT_MARGIN))
      .div(100))
  }

  return earnings
}
/**
 *
 * @param {Object} market
 * @param {Array} netOutcomeTokensSold - amount of outcome tokens sold including the amount user is going to sell
 * @param {Object} [share] - user's share, needed only for categorical markets
 * @returns {Decimal}
 */
const calculateNewProbability = (market, share, netOutcomeTokensSold) => {
  const categoricalMarketWithoutShare = !share && market.event && market.event.type === OUTCOME_TYPES.CATEGORCAL
  if (!market || categoricalMarketWithoutShare) {
    throw new Error()
  }

  const { event: { type } } = market

  // When calculating for SCALAR markets, we need to always calculate for long outcome
  // For categorical we should calculate for share's outcome
  const outcomeTokenIndex = type === OUTCOME_TYPES.SCALAR ? 1 : share.outcomeToken.index

  return calcLMSRMarginalPrice({
    netOutcomeTokensSold,
    funding: market.funding,
    outcomeTokenIndex,
  })
}

export { calculateCurrentProbability, calculateEarnings, calculateNewProbability }

import Decimal from 'decimal.js'
import { calcLMSROutcomeTokenCount } from 'api'
import { LIMIT_MARGIN } from 'utils/constants'
import { NUMBER_REGEXP } from '../'

/**
 *  Calculates how much outcome tokens you get for value you want to invest
 * @param {Object} market
 * @param {string|number} investment
 * @param {string|number} outcomeIndex
 * @param {Decimal|string|number} limitMargin
 * @returns {Decimal}
 */
const getOutcomeTokenCount = (market, investment, outcomeIndex, limitMargin) => {
  if (!market || !investment || !outcomeIndex || !NUMBER_REGEXP.test(investment) || parseFloat(investment) < 0) {
    return Decimal(0)
  }

  const invest = new Decimal(investment)
    .mul(1e18)
    .div(new Decimal(100).add(limitMargin || LIMIT_MARGIN))
    .mul(100)
    .round()
  const { funding, outcomeTokensSold, fee } = market

  let outcomeTokenCount
  try {
    outcomeTokenCount = calcLMSROutcomeTokenCount({
      feeFactor: fee,
      netOutcomeTokensSold: outcomeTokensSold.toArray(),
      funding,
      outcomeTokenIndex: parseInt(outcomeIndex, 10),
      cost: invest.toString(),
    })
  } catch (e) {
    console.error(e)
    return Decimal(0)
  }

  return outcomeTokenCount
}
/**
 * Calculates maximum win amount
 * @param {Decimal|string|number} outcomeTokenCount
 * @param {Decimal|string|number} investment
 * @returns {Decimal}
 */
const getMaximumWin = (outcomeTokenCount, investment) => {
  if (!NUMBER_REGEXP.test(investment) || !parseFloat(investment) > 0 || !outcomeTokenCount) {
    return Decimal(0)
  }

  return Decimal(outcomeTokenCount)
    .sub(Decimal(investment).mul(1e18))
    .div(1e18)
}

/**
 * Calculates maximum return
 * @param {Decimal|string|number} outcomeTokenCount
 * @param {Decimal|string|number} investment
 * @returns {Decimal}
 */
const getPercentageWin = (outcomeTokenCount, investment) => {
  if (!NUMBER_REGEXP.test(investment) || !parseFloat(investment) > 0 || !outcomeTokenCount) {
    return Decimal(0)
  }

  const invest = new Decimal(investment).mul(1e18)
  return Decimal(outcomeTokenCount)
    .div(invest)
    .mul(100)
    .sub(100)
}

export { getOutcomeTokenCount, getMaximumWin, getPercentageWin }

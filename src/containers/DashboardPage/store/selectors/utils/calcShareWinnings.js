import { Decimal } from 'decimal.js'
import { OUTCOME_TYPES } from 'utils/constants'

const SCALAR_OUTCOME_RANGE = 1000000

const calcShareWinningsCategorical = (share, market, event) => {
  const outcome = parseInt(event.outcome, 10)
  const shareOutcome = parseInt(share.outcomeToken.index, 10)
  if (shareOutcome !== outcome) {
    return '0'
  }

  return Decimal(share.balance).toString()
}

const calcShareWinningsScalar = (share, market, event) => {
  const outcomeRange = Decimal(SCALAR_OUTCOME_RANGE)
  const outcome = Decimal(parseInt(event.outcome, 10))
  const lowerBound = Decimal(event.lowerBound)
  const upperBound = Decimal(event.upperBound)

  let outcomeClamped = Decimal(0)

  if (outcome.lt(lowerBound)) {
    outcomeClamped = Decimal(0)
  } else if (outcome.gt(upperBound)) {
    outcomeClamped = outcomeRange
  } else {
    outcomeClamped = outcomeRange.mul(outcome.sub(lowerBound).toString()).div(upperBound.sub(lowerBound).toString())
  }

  const factorShort = outcomeRange.sub(outcomeClamped)
  const factorLong = outcomeRange.sub(factorShort.toString())

  const isShort = parseInt(share.outcomeToken.index, 10) === 0
  const isLong = parseInt(share.outcomeToken.index, 10)
  if (isShort) {
    return Decimal(share.balance)
      .mul(factorShort)
      .div(outcomeRange)
  }

  if (isLong) {
    return Decimal(share.balance)
      .mul(factorLong)
      .div(outcomeRange)
      .toString()
  }

  throw new Error(`Invalid Outcome for Scalar Event found: ${share.outcomeToken.index}`)
}

export const calcShareWinnings = (share, market, event) => {
  const isCategorical = event.type === OUTCOME_TYPES.CATEGORICAL

  return isCategorical
    ? calcShareWinningsCategorical(share, market, event)
    : calcShareWinningsScalar(share, market, event)
}

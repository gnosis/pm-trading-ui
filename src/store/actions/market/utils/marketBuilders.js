import { List } from 'immutable'
import { BoundsRecord, CategoricalMarketRecord, ScalarMarketRecord, OutcomeRecord } from 'store/models'
import { isMarketClosed } from 'store/utils/marketStatus'
import { OUTCOME_TYPES } from 'utils/constants'

const buildOutcomesFrom = (outcomes, outcomeTokensSold, marginalPrices) => {
  if (!outcomes) {
    return List([])
  }

  const outcomesRecords = outcomes.map((outcome, index) =>
    new OutcomeRecord({
      name: outcome,
      index,
      marginalPrice: marginalPrices[index],
      outcomeTokensSold: outcomeTokensSold[index],
    }))

  return List(outcomesRecords)
}

const buildBoundsFrom = (lower, upper, unit, decimals) =>
  BoundsRecord({
    lower,
    upper,
    unit,
    decimals: parseInt(decimals, 10),
  })

const buildScalarMarket = (market) => {
  const {
    stage,
    contract: { address, creationDate, creator },
    tradingVolume,
    funding,
    netOutcomeTokensSold,
    event: {
      contract: { address: eventAddress },
      type,
      collateralToken,
      lowerBound,
      upperBound,
      isWinningOutcomeSet,
      oracle: {
        isOutcomeSet,
        outcome,
        eventDescription: {
          title, description, resolutionDate, unit, decimals,
        },
      },
    },
  } = market

  const outcomesResponse = ['SHORT', 'LONG']

  const outcomes = buildOutcomesFrom(outcomesResponse, netOutcomeTokensSold, market.marginalPrices)
  const bounds = buildBoundsFrom(lowerBound, upperBound, unit, decimals)

  const resolved = isOutcomeSet || isWinningOutcomeSet
  const closed = isMarketClosed(stage, resolutionDate, resolved)

  const marketRecord = new ScalarMarketRecord({
    title,
    description,
    creator,
    collateralToken,
    address,
    stage,
    type,
    outcomes,
    bounds,
    eventAddress,
    resolution: resolutionDate,
    creation: creationDate,
    volume: tradingVolume,
    resolved,
    closed,
    winningOutcome: outcome,
    funding: funding || 0,
    outcomeTokensSold: List(netOutcomeTokensSold),
  })

  return marketRecord
}

const buildCategoricalMarket = (market) => {
  const {
    stage,
    contract: { address, creationDate, creator },
    tradingVolume,
    funding,
    netOutcomeTokensSold,
    event: {
      contract: { address: eventAddress },
      collateralToken,
      isWinningOutcomeSet,
      oracle: {
        isOutcomeSet,
        outcome: winningOutcomeIndex,
        eventDescription: {
          title, description, resolutionDate, outcomes: outcomeLabels,
        },
      },
    },
  } = market

  const outcomes = buildOutcomesFrom(outcomeLabels, netOutcomeTokensSold, market.marginalPrices)

  const resolved = isOutcomeSet || isWinningOutcomeSet
  const closed = isMarketClosed(stage, resolutionDate, resolved)

  const marketRecord = new CategoricalMarketRecord({
    title,
    description,
    creator,
    collateralToken,
    address,
    stage,
    outcomes,
    eventAddress,
    resolution: resolutionDate,
    creation: creationDate,
    volume: tradingVolume,
    resolved,
    closed,
    funding: funding || 0,
    winningOutcome: outcomes.get(winningOutcomeIndex),
    outcomeTokensSold: List(netOutcomeTokensSold),
  })

  return marketRecord
}

export default {
  [OUTCOME_TYPES.CATEGORICAL]: buildCategoricalMarket,
  [OUTCOME_TYPES.SCALAR]: buildScalarMarket,
}

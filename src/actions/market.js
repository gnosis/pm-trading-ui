import moment from 'moment'
import Decimal from 'decimal.js'
import { normalize } from 'normalizr'
import uuid from 'uuid/v4'
import * as api from 'api'

import {
  receiveEntities,
  updateEntity,
} from 'actions/entities'

import {
  startLog,
  closeLog,
  closeEntrySuccess,
  closeEntryError,
} from 'actions/transactions'

import {
  createEventDescriptionModel,
  createOracleModel,
  createEventModel,
  createMarketModel,
} from 'api/models'

import {
  eventDescriptionSchema,
  eventSchema,
  oracleSchema,
  marketSchema,
} from 'api/schema'

import {
  OUTCOME_TYPES,
  TRANSACTION_COMPLETE_STATUS,
} from 'utils/constants'

const TRANSACTION_STAGES = {
  EVENT_DESCRIPTION: 'eventDescription',
  ORACLE: 'oracle',
  EVENT: 'event',
  MARKET: 'market',
  FUNDING: 'funding',
}

const TRANSACTION_EVENTS = [
  {
    event: TRANSACTION_STAGES.EVENT_DESCRIPTION,
    label: 'Create Event Description',
  },
  {
    event: TRANSACTION_STAGES.ORACLE,
    label: 'Create Oracle',
  },
  {
    event: TRANSACTION_STAGES.EVENT,
    label: 'Create Event',
  },
  {
    event: TRANSACTION_STAGES.MARKET,
    label: 'Create Market',
  },
  {
    event: TRANSACTION_STAGES.FUNDING,
    label: 'Fund Market',
  },
]

const TRANSACTION_STAGES_RESOLVE = {
  RESOLVE: 'RESOLVE',
}

const TRANSACTION_EVENTS_RESOLVE = [
  {
    event: TRANSACTION_STAGES_RESOLVE.RESOLVE,
    label: 'Resolve Oracle',
  }
]

export const requestMarket = marketAddress => async (dispatch) => {
  const payload = await api.requestMarket(marketAddress)
  return await dispatch(receiveEntities(payload))
}

export const requestMarkets = () => async (dispatch) => {
  const payload = await api.requestMarkets()
  return await dispatch(receiveEntities(payload))
}

export const requestMarketShares = (marketAddress, accountAddress) => async (dispatch) => {
  const payload = await api.requestMarketShares(marketAddress, accountAddress)
  return await dispatch(receiveEntities(payload))
}

export const requestFactories = () => async (dispatch) => {
  const payload = await api.requestFactories()
  return await dispatch(receiveEntities(payload))
}

export const requestMarketParticipantTrades = (marketAddress, accountAddress) => async (dispatch) => {
  const payload = await api.requestMarketParticipantTrades(marketAddress, accountAddress)
  return await dispatch(receiveEntities(payload))
}

export const createMarket = options => async (dispatch) => {
  const {
    eventDescription,
    oracle,
    event,
    market,
    transactionId,
  } = options

  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS, `Creating Market "${eventDescription.title}"`))

  // Create Event Description
  let eventDescriptionContractData
  try {
    eventDescriptionContractData = await api.createEventDescription(eventDescription)

    await dispatch(receiveEntities(normalize(createEventDescriptionModel(eventDescriptionContractData), eventDescriptionSchema)))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.EVENT_DESCRIPTION))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.EVENT_DESCRIPTION, e))
    return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
  }

  // Create Oracle
  let oracleContractData
  try {
    // Take from EventDescription
    oracle.eventDescription = eventDescriptionContractData.ipfsHash

    oracleContractData = await api.createOracle(oracle)
    await dispatch(receiveEntities(normalize(createOracleModel(oracleContractData), oracleSchema)))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.ORACLE))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.ORACLE, e))
    return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
  }

  // Create Event
  let eventContractData
  try {
    // Take from Oracle
    event.oracle = oracleContractData.address

    if (event.type === OUTCOME_TYPES.CATEGORICAL) {
      event.outcomeCount = (eventDescription.outcomes || []).length
    } else if (event.type === OUTCOME_TYPES.SCALAR) {
      event.lowerBound = Decimal(event.lowerBound).times(10 ** event.decimals).toString()
      event.upperBound = Decimal(event.upperBound).times(10 ** event.decimals).toString()
    }

    eventContractData = await api.createEvent(event)
    await dispatch(receiveEntities(normalize(createEventModel(eventContractData), eventSchema)))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.EVENT))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.EVENT, e))
    return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
  }


  let marketContractData
  try {
    // Take from Event
    market.event = eventContractData.address

    if (event.type === OUTCOME_TYPES.CATEGORICAL) {
      market.outcomes = eventDescription.outcomes
    } else if (event.type === OUTCOME_TYPES.SCALAR) {
      market.outcomes = [0, 1] // short, long
    }

    // Create Market
    marketContractData = await api.createMarket(market)
    await dispatch(receiveEntities(normalize(createMarketModel(marketContractData), marketSchema)))
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.MARKET))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.MARKET, e))
    return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
  }

  // Fund Market
  try {
    await api.fundMarket({
      ...marketContractData,
      funding: market.funding,
    })

    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES.FUNDING))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES.FUNDING, e))
    return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
  }

  return await dispatch(closeLog(transactionId))
}

export const buyMarketShares = (market, outcomeIndex, amount) => async (dispatch) => {
  await api.buyShares(market, outcomeIndex, amount)

  const netOutcomeTokensSold = market.netOutcomeTokensSold
  const newOutcomeTokenAmount = parseInt(netOutcomeTokensSold[outcomeIndex], 10) + (amount * 1e18)
  netOutcomeTokensSold[outcomeIndex] = newOutcomeTokenAmount.toString()

  return dispatch(updateEntity({
    entityType: 'markets',
    data: {
      id: market.address,
      netOutcomeTokensSold,
    },
  }))
}

export const sellMarketShares = (market, outcomeIndex, amount) =>
  async () => await api.sellShares(market, outcomeIndex, amount)

export const resolveMarket = (market, outcomeIndex) => async (dispatch) => {
  const transactionId = uuid()
  
  // Start a new transaction log
  await dispatch(startLog(transactionId, TRANSACTION_EVENTS_RESOLVE, `Resolving Oracle for "${market.eventDescription.title}"`))

  try {
    await api.resolveEvent(market.event, outcomeIndex)
    await dispatch(closeEntrySuccess(transactionId, TRANSACTION_STAGES_RESOLVE.RESOLVE))
  } catch (e) {
    console.error(e)
    await dispatch(closeEntryError(transactionId, TRANSACTION_STAGES_RESOLVE.RESOLVE, e))
    return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.ERROR))
  }

  await dispatch(updateEntity({ entityType: 'oracles', data: { id: market.oracle.address, isOutcomeSet: true, outcome: outcomeIndex } }))
  await dispatch(updateEntity({ entityType: 'events', data: { id: market.event.address, isWiningOutcomeSet: true } }))

  return await dispatch(closeLog(transactionId, TRANSACTION_COMPLETE_STATUS.NO_ERROR))
}

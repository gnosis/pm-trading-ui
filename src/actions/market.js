import moment from 'moment'
import Decimal from 'decimal.js'

import {
  requestMarkets,
  receiveEntities,
  updateEntity,
} from 'actions/entities'

import {
  startTransactionLog,
  closeTransactionLog,
  addTransactionLogEntry,
} from 'actions/transactions'

import {
  toEntity,
} from 'utils/helpers'

import {
  OUTCOME_TYPES,
  TRANSACTION_STATUS,
  TRANSACTION_COMPLETE_STATUS,
} from 'utils/constants'

import * as api from 'api'

export const requestMarketList = () => async (dispatch) => {
  await dispatch(requestMarkets())
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
  await dispatch(startTransactionLog({
    id: transactionId,
    startTime: moment().format(),
    events: [
      {
        event: 'eventDescription',
        label: 'Create Event Description',
      },
      {
        event: 'oracle',
        label: 'Create Oracle',
      },
      {
        event: 'event',
        label: 'Create Event',
      },
      {
        event: 'market',
        label: 'Create Market',
      },
      {
        event: 'funding',
        label: 'Fund Market',
      },
    ],
  }))

  // Create Event Description
  const eventDescriptionContractData = await api.createEventDescription(eventDescription)
  await dispatch(receiveEntities(toEntity(eventDescriptionContractData, 'eventDescriptions', 'ipfsHash')))
  await dispatch(addTransactionLogEntry({
    id: options.transactionId,
    event: 'eventDescription',
    status: TRANSACTION_STATUS.DONE,
  }))

  // Take from EventDescription
  oracle.eventDescription = eventDescriptionContractData.ipfsHash

  // Create Oracle
  const oracleContractData = await api.createOracle(oracle)
  await dispatch(receiveEntities(toEntity(oracleContractData, 'oracles')))
  await dispatch(addTransactionLogEntry({
    id: options.transactionId,
    event: 'oracle',
    status: TRANSACTION_STATUS.DONE,
  }))

  // Take from Oracle
  event.oracle = oracleContractData.address

  if (event.type === OUTCOME_TYPES.CATEGORICAL) {
    event.outcomeCount = (eventDescription.outcomes || []).length
  } else if (event.type === OUTCOME_TYPES.SCALAR) {
    event.lowerBound = Decimal(event.lowerBound).times(10 ** event.decimals).toString()
    event.upperBound = Decimal(event.upperBound).times(10 ** event.decimals).toString()
  }

  // Create Event
  const eventContractData = await api.createEvent(event)
  await dispatch(receiveEntities(toEntity(eventContractData, 'events')))
  await dispatch(addTransactionLogEntry({
    id: options.transactionId,
    event: 'event',
    status: TRANSACTION_STATUS.DONE,
  }))

  // Take from Event
  market.event = eventContractData.address

  if (event.type === OUTCOME_TYPES.CATEGORICAL) {
    market.outcomes = eventDescription.outcomes
  } else if (event.type === OUTCOME_TYPES.SCALAR) {
    market.outcomes = [0, 1] // short, long
  }

  // Create Market
  const marketContractData = await api.createMarket(market)
  await dispatch(receiveEntities(toEntity(marketContractData, 'markets')))
  await dispatch(addTransactionLogEntry({
    id: options.transactionId,
    event: 'market',
    status: TRANSACTION_STATUS.DONE,
  }))

  // Fund Market
  await api.fundMarket(marketContractData)
  await dispatch(addTransactionLogEntry({
    id: options.transactionId,
    event: 'funding',
    status: TRANSACTION_STATUS.DONE,
  }))

  await dispatch(closeTransactionLog({
    id: options.transactionId,
    completed: true,
    completionStatus: TRANSACTION_COMPLETE_STATUS.NO_ERROR,
    endTime: moment().format(),
  }))
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

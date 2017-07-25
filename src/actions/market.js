import moment from 'moment'

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
  TRANSACTION_STATUS,
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
    startTime: moment().format(),
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
  event.oracle = oracleContractData.oracle

  // Create Event
  const eventContractData = await api.createEvent(event)
  await dispatch(receiveEntities(toEntity(eventContractData, 'events')))
  await dispatch(addTransactionLogEntry({
    id: options.transactionId,
    event: 'event',
    status: TRANSACTION_STATUS.DONE,
  }))

  // Take from Event
  market.event = eventContractData.event

  // Create Market
  const marketContractData = await api.createMarket(market)
  await dispatch(receiveEntities(toEntity(market, 'markets')))
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

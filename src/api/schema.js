import { schema } from 'normalizr'
import { mapValues } from 'lodash'
import Decimal from 'decimal.js'
import sha1 from 'sha1'

import { hexWithPrefix } from 'utils/helpers'

const normalizeShareObject = share => ({
  event: share.outcomeToken.event,
  ...share,
  outcomeToken: mapValues(share.outcomeToken, hexWithPrefix),
})

const normalizeTradeObject = trade => ({
  ...trade,
  outcomeToken: mapValues(trade.outcomeToken, hexWithPrefix),
  owner: trade.owner ? hexWithPrefix(trade.owner) : undefined,
})

const shareMerge = (shareA, shareB) => {
  console.warn('merging', shareA, shareB)
  return {
    ...shareA,
    ...shareB,
    balance: Decimal(shareA.balance).add(shareB.balance).toString(),
  }
}

/**
 * Merges entity.contract into entity, discarding "contract" from the original entity
 * @param {object} entity
 */
const mergeContract = (entity) => {
  if (entity.contract) {
    const {
      contract: {
        creationBlock, creator, creationDate, address,
      },
      ...entityWithoutContract
    } = entity

    return {
      address,
      creationBlock,
      creator,
      creationDate,
      ...entityWithoutContract,
    }
  }

  return entity
}

/**
 * Iterates over every field of the entity and normalizes hex values from "0xABC" to "ABC"
 * @param {object} entity
 */
const normalizeHexValues = entity => mapValues(entity, hexWithPrefix)

const NORMALIZE_OPTIONS_DEFAULT = {
  idAttribute: value => value.address || value.contract.address,
  processStrategy: entity => mergeContract(normalizeHexValues(entity)),
}

export const eventDescriptionSchema = new schema.Entity('eventDescriptions', {}, {
  ...NORMALIZE_OPTIONS_DEFAULT,
  idAttribute: 'ipfsHash',
})

export const oracleSchema = new schema.Entity('oracles', {
  eventDescription: eventDescriptionSchema,
}, {
  ...NORMALIZE_OPTIONS_DEFAULT,
})

export const eventSchema = new schema.Entity('events', {
  oracle: oracleSchema,
}, {
  ...NORMALIZE_OPTIONS_DEFAULT,
})

export const marketSchema = new schema.Entity('markets', {
  event: eventSchema,
}, {
  ...NORMALIZE_OPTIONS_DEFAULT,
})

export const marketTradesSchema = new schema.Entity('marketTrades', {}, {
  ...NORMALIZE_OPTIONS_DEFAULT,
  idAttribute: trade => sha1(`${trade.date}-${trade.owner}-${trade.market}`), // unique identifier for trades,
  processStrategy: entity => normalizeTradeObject(mergeContract(normalizeHexValues(entity))),
})

export const marketSharesSchema = new schema.Entity('marketShares', {}, {
  ...NORMALIZE_OPTIONS_DEFAULT,
  idAttribute: share => sha1(`${share.owner}-${share.outcomeToken.event}-${share.outcomeToken.index}`), // unique identifier for shares,
  processStrategy: entity => normalizeShareObject(mergeContract(normalizeHexValues(entity))),
  mergeStrategy: (entityA, entityB) => shareMerge(entityA, entityB),
})

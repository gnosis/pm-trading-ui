import { schema } from 'normalizr'
import { flow, mapValues, trimStart } from 'lodash'

const HEX_VALUE_REGEX = /(0x)?[0-9A-Fa-f]{40}/

/**
 * Merges entity.contract into entity, discarding "contract" from the original entity
 * @param {object} entity
 */
const mergeContract = (entity) => {
  if (entity.contract) {
    const {
      contract: { creationBlock, creator, creationDate, address },
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
const normalizeHexValues = entity =>
  mapValues(entity, (value) => {
    if (HEX_VALUE_REGEX.test(value)) {
      return trimStart(value, '0x')
    }

    return value
  })

const NORMALIZE_OPTIONS_DEFAULT = {
  idAttribute: value => value.address || value.contract.address,
  processStrategy: flow(mergeContract, normalizeHexValues),
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

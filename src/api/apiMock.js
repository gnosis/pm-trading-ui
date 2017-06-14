import { normalize } from 'normalizr'
import moment from 'moment'

import {
  MarketSchema,
  CategoricalEventSchema,
  ScalarEventSchema,
  CategoricalEventDescriptionSchema,
  ScalarEventDescriptionSchema,
  CentralizedOracleSchema,
} from './schema'

export const requestMarkets = async () => normalize([
  {
    address: '0x76cf4a2c6ae881de2cda3e84a257e4b22623b089a391b4edbceecfca51152475',
    factory: 'test',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    event: null,
    marketMaker: 'LSRM',
    fee: 2.323204,
    funding: 402.232323,
    netOutcomeTokensSold: [1, 4, 2], // ???
    stage: 0,
  },
  {
    address: '0x76cf4a2c6ae881de2cda3e84a257e4b22623b089a391b4edbceecfca51152475',
    factory: 'test',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    event: null,
    marketMaker: 'LSRM',
    fee: 2.323204,
    funding: 402.232323,
    netOutcomeTokensSold: [1, 4, 2], // ???
    stage: 0,
  },
], [MarketSchema])

export const requestCategoricalEvents = async () => normalize([
  {
    address: '0x76cf4a2c6ae881de2cda3e84a257e4b22623b089a391b4edbceecfca51152475',
    factory: 'test',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    oracle: null,
    isOutcomeSet: false,
    outcome: null,
    collateralToken: 'ETH', // string or hex key
  },
], [CategoricalEventSchema])

export const requestScalarEvents = async () => normalize([
  {
    address: '0x76cf4a2c6ae881de2cda3e84a257e4b22623b089a391b4edbceecfca51152475',
    factory: 'test',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    oracle: null,
    isOutcomeSet: false,
    outcome: null,
    collateralToken: 'ETH', // string or hex key
    lowerBound: 5000.00,
    upperBound: 12000.00,
  },
], [ScalarEventSchema])

export const requestCategoricalEventDescriptions = async () => normalize([
  {
    ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme',
    title: 'Who will be the next President of the United States of America?',
    description: 'Who will be the new president in 2020?',
    resolutionDate: moment.utc('2020-11-03 10:00:00'),
  },
], [CategoricalEventDescriptionSchema])

export const requestScalarEventDescription = async () => normalize([
  {
    ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme',
    title: 'DAX Performance in 2 weeks',
    description: 'Who will be the new president in 2020?',
    resolutionDate: moment.utc('2020-11-03 10:00:00'),
    units: 'Points',
  },
], [ScalarEventDescriptionSchema])

export const requestCentralizedOracles = async () => normalize([
  {
    address: '0x76cf4a2c6ae881de2cda3e84a257e4b22623b089a391b4edbceecfca51152475',
    factory: 'test',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    owner: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    eventDescription: null,
  },
], [CentralizedOracleSchema])

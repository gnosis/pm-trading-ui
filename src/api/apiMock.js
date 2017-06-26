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
    id: '0xhghx4j2cgTn41rrydvOuNHgVJ0uF67oYW2KQjKtQMhIMIGw1TSDiWzPrUHeS1yx',
    factory: 'test',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    event: '0xTG6TgmyRL8eFAf4cbe1jV91s8zIEdEWE75wNOOlVDX3jfof9xN2CSydx5AH8JoB',
    marketMaker: 'LSRM',
    fee: 2.323204,
    funding: 402.232323,
    netOutcomeTokensSold: [1, 4, 2], // ???
    stage: 0,
  },
  {
    id: '0xoZ5B3daQFrMMcUFXFAS7VV8mLUz0EOaAK684r1rFEnYPtwQoA7KpmGiikQ1Nd9T',
    factory: 'test',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    event: '0xlRDVeyFmqyL3NQFaQ7uYgtrNWydMvoez1ad7YGAi1ZsBIETF3E8vJm8UlKvqjgm',
    marketMaker: 'LSRM',
    fee: 2.323204,
    funding: 402.232323,
    netOutcomeTokensSold: [1, 4, 2], // ???
    stage: 0,
  },
  {
    id: '0xSdsjsakldjakEJIQWUoixc87a89w3kldjkldJEWJLKejkdsjlkjxcsnmqwewqes',
    factory: 'test',
    creator: '0xBSJdhaehwJKEHWeisducdaisdjklasdjklasjdlk',
    creationDate: moment.utc('2017-02-01 09:32:11'),
    creationBlock: '32320202',
    event: '0xdfdkjewklrkewrewriudvioxuioxcvnm6nfdms0nfdfseof9xN2CSydx5AH8JoB',
    marketMaker: 'LSRM',
    fee: 5.23222,
    funding: 2.23232,
    netOutcomeTokensSold: [1, 4, 2], // ???
    stage: 0,
  },
], [MarketSchema])

export const requestCategoricalEvents = async () => normalize([
  {
    id: '0xTG6TgmyRL8eFAf4cbe1jV91s8zIEdEWE75wNOOlVDX3jfof9xN2CSydx5AH8JoB',
    factory: 'test',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    oracle: '0xu4QOAydUtR34M9VcjxHqb7aAVyA2OYruA9ZlBUvUO6Qj27P9McNjPwBJLB2AvxW',
    isOutcomeSet: false,
    outcome: null,
    collateralToken: 'Ether Tokens', // string or hex key
  },
  {
    id: '0xdfdkjewklrkewrewriudvioxuioxcvnm6nfdms0nfdfseof9xN2CSydx5AH8JoB',
    factory: 'test',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    oracle: '0xSDdSnSDXYBN6sjahkasdkjHSDJKsKJHDWEUQZWiuoicuoixyosBJLB2AvxW',
    isOutcomeSet: false,
    outcome: null,
    collateralToken: 'Bitcoin', // string or hex key
  },
], [CategoricalEventSchema])

export const requestScalarEvents = async () => normalize([
  {
    id: '0xlRDVeyFmqyL3NQFaQ7uYgtrNWydMvoez1ad7YGAi1ZsBIETF3E8vJm8UlKvqjgm',
    factory: 'test',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    oracle: '0xsjf4eWG2mvhiuZ1xtAPLvx4v15rcGr7b2vGMBcK244RvoP4aSR9hrvtqnOvyWAP',
    isOutcomeSet: false,
    outcome: null,
    collateralToken: 'Ether Tokens', // string or hex key
    lowerBound: 5000.00,
    upperBound: 12000.00,
  },
], [ScalarEventSchema])

export const requestCategoricalEventDescriptions = async () => normalize([
  {
    id: '0xIaSSn4ANXaOCoKbVx6NDjNMGKYVF456NuBpNn1d05DmNfdLcujgWKXlz0swMlQm',
    ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme',
    title: 'Who will be the next President of the United States of America?',
    description: 'Who will be the new president in 2020?',
    resolutionDate: moment.utc('2020-11-03 10:00:00'),
  }, {
    id: '0xSg323hjgdjhsgiuaisdaUIDZzdshdagdsjhgahdjgasjhdgshjdgajhseazeu5t',
    ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme',
    title: 'When will the Gnosis Token Auction start?',
    description: 'When will the auction start?',
    resolutionDate: moment.utc('2017-06-01 10:00:00'),
  },
], [CategoricalEventDescriptionSchema])

export const requestScalarEventDescriptions = async () => normalize([
  {
    id: '0xQfOe6hhJPyMJ7M3ep5JLUGOOGbYnLqbQZDdj9nHRPZx4yzyq3txq1B1gH1mDT4b',
    ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme',
    title: 'DAX Performance in 2 weeks',
    description: 'Stock prices!',
    resolutionDate: moment.utc().add(13, 'minutes'),
    units: 'Points',
  },
], [ScalarEventDescriptionSchema])

export const requestCentralizedOracles = async () => normalize([
  {
    id: '0xSDdSnSDXYBN6sjahkasdkjHSDJKsKJHDWEUQZWiuoicuoixyosBJLB2AvxW',
    factory: 'test',
    creator: '0xBSJdhaehwJKEHWeisducdaisdjklasdjklasjdlk',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    owner: '0xBSJdhaehwJKEHWeisducdaisdjklasdjklasjdlk',
    eventDescription: '0xSg323hjgdjhsgiuaisdaUIDZzdshdagdsjhgahdjgasjhdgshjdgajhseazeu5t',
  }, {
    id: '0xsjf4eWG2mvhiuZ1xtAPLvx4v15rcGr7b2vGMBcK244RvoP4aSR9hrvtqnOvyWAP',
    factory: 'test',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    owner: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    eventDescription: '0xQfOe6hhJPyMJ7M3ep5JLUGOOGbYnLqbQZDdj9nHRPZx4yzyq3txq1B1gH1mDT4b',
  }, {
    id: '0xu4QOAydUtR34M9VcjxHqb7aAVyA2OYruA9ZlBUvUO6Qj27P9McNjPwBJLB2AvxW',
    factory: 'bob',
    creator: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    creationDate: moment.utc('2017-06-03 12:53:22'),
    creationBlock: '53094839',
    owner: '0xB00A24C899F88e5514583CFa8c40e4CDAB6C473e',
    eventDescription: '0xIaSSn4ANXaOCoKbVx6NDjNMGKYVF456NuBpNn1d05DmNfdLcujgWKXlz0swMlQm',
  },
], [CentralizedOracleSchema])

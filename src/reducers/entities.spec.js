import { updateEntity, receiveEntities } from 'actions/entities'
import { getMarkets } from 'selectors/market'

import entityReducer from './entities'

const TEST_MARKET = {
  address: '0x003',
  creationBlock: 1436571,
  creator: '0x123',
  creationDate: '2017-12-18T14:52:24',
  event: '0x002',
  marketMaker: '0x00',
  fee: 0,
  funding: '500000000000000000000',
  netOutcomeTokensSold: [
    '4766300647641683073234',
    '2761779498301361020355',
  ],
  stage: 2,
  tradingVolume: '4538095922090484836044',
  withdrawnFees: '0',
  collectedFees: '0',
  marginalPrices: [
    '0.9415',
    '0.0585',
  ],
}
const TEST_EVENT_DESCRIPTION = {
  outcomes: [
    'Yes',
    'No',
  ],
  ipfsHash: 'testhash',
  description: 'This is a testmarket',
  resolutionDate: '2017-12-22T00:00:00',
  title: 'Testmarket',
}
const TEST_ORACLE = {
  address: '0x001',
  creationBlock: 1436567,
  creator: '0x9035490075f40fab4f040fd42bc0d7cd3429a32d',
  creationDate: '2017-12-18T14:51:24',
  isOutcomeSet: true,
  outcome: 0,
  owner: '0x9035490075f40fab4f040fd42bc0d7cd3429a32d',
  eventDescription: 'testhash',
  type: 'CENTRALIZED',
}
const TEST_EVENT = {
  address: '0x002',
  creationBlock: 1436569,
  creator: '0x9035490075f40fab4f040fd42bc0d7cd3429a32d',
  creationDate: '2017-12-18T14:51:54',
  collateralToken: '0xa0c107db0e9194c18359d3265289239453b56cf2',
  oracle: '0x001',
  isWinningOutcomeSet: true,
  outcome: '0',
  type: 'CATEGORICAL',
}

describe('Add a Market', () => {
  test('Add a market in an empty store', () => {
    // GIVEN
    const emptyEntityReducer = {}
    const receiveMarketAction = receiveEntities({
      entities: {
        eventDescriptions: { [TEST_EVENT_DESCRIPTION.ipfsHash]: TEST_EVENT_DESCRIPTION },
        oracles: { [TEST_ORACLE.address]: TEST_ORACLE },
        events: { [TEST_EVENT.address]: TEST_EVENT },
        markets: { [TEST_MARKET.address]: TEST_MARKET },
      },
    })

    // WHEN
    const entityReducerWithMarket = entityReducer(emptyEntityReducer, receiveMarketAction)

    // THEN
    const state = { entities: entityReducerWithMarket }
    const markets = getMarkets(state)
    expect(markets.length).toBe(1)

    const market = markets[0]
    expect(market).toBeDefined()

    expect(market.oracle).toMatchObject(TEST_ORACLE)
    expect(market.eventDescription).toMatchObject(TEST_EVENT_DESCRIPTION)
    expect(market.event).toMatchObject(TEST_EVENT)

    expect(market.oracle).not.toBe(TEST_ORACLE) // no mutation check
    expect(market.eventDescription).not.toBe(TEST_EVENT_DESCRIPTION) // no mutation check
    expect(market.event).not.toBe(TEST_EVENT) // no mutation check
  })

  test('Update an existing market', () => {
    // GIVEN
    const currentState = {
      eventDescriptions: { [TEST_EVENT_DESCRIPTION.ipfsHash]: TEST_EVENT_DESCRIPTION },
      oracles: { [TEST_ORACLE.address]: TEST_ORACLE },
      events: { [TEST_EVENT.address]: TEST_EVENT },
      markets: { [TEST_MARKET.address]: TEST_MARKET },
    }
    const updateMarketAction = updateEntity({
      entityType: 'oracles',
      data: {
        id: TEST_ORACLE.address,
        creator: '0xf00',
      },
    })

    // WHEN
    const updatedState = entityReducer(currentState, updateMarketAction)

    // THEN
    const state = { entities: updatedState }
    const markets = getMarkets(state)
    expect(markets.length).toBe(1)

    const market = markets[0]
    expect(market).toBeDefined()

    expect(market.eventDescription).toMatchObject(TEST_EVENT_DESCRIPTION)
    expect(market.event).toMatchObject(TEST_EVENT)

    expect(market.oracle.creator).toMatch('0xf00')
    expect(market.oracle.creationDate).toMatch(TEST_ORACLE.creationDate)
    expect(market.oracle).not.toBe(updateMarketAction.payload.data) // no mutation check

    expect(market.eventDescription).not.toBe(TEST_EVENT_DESCRIPTION) // no mutation check
    expect(market.event).not.toBe(TEST_EVENT) // no mutation check
  })
})

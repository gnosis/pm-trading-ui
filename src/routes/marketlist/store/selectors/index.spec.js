import moment from 'moment'
import { List } from 'immutable'
import { MARKET_STAGES } from '../models/market'
import { REDUCER_ID } from '../reducers/market'
import aMarket from '../reducers/market.builder'
import { marketSelector, openMarketSelector } from './index'

describe('Market List Selectors', () => {
  it('get empty immutable List when they are not loaded', () => {
    // GIVEN
    const emptyList = List([])
    const reduxStore = { [REDUCER_ID]: emptyList }

    // WHEN
    const marketListState = marketSelector(reduxStore)

    // THEN
    expect(marketListState).toEqual(emptyList)
  })

  it('return 2 open markets if there backend only have two of three opened', () => {
    // GIVEN
    const aClosedMarket = aMarket()
      .withDate(moment().subtract(1, 'M'))
      .withStage(MARKET_STAGES.MARKET_CLOSED)
      .get()

    const aOpenMarketViaStage = aMarket()
      .withStage(MARKET_STAGES.MARKET_FUNDED)
      .get()

    const aOpenMarketViaDate = aMarket()
      .withDate(moment().add(1, 'M'))
      .withStage(1)
      .get()

    const markets = List([aClosedMarket, aOpenMarketViaStage, aOpenMarketViaDate])
    const reduxStore = { [REDUCER_ID]: markets }

    // WHEN
    const openMarkets = openMarketSelector(reduxStore)

    // THEN
    expect(2).toEqual(openMarkets)
  })

  it('return 0 open markets if there is no open markets', () => {
    // GIVEN
    const aClosedMarket = aMarket()
      .withDate(moment().subtract(1, 'M'))
      .withStage(MARKET_STAGES.MARKET_CLOSED)
      .get()

    const markets = List([aClosedMarket])
    const reduxStore = { [REDUCER_ID]: markets }

    // WHEN
    const openMarkets = openMarketSelector(reduxStore)

    // THEN
    expect(0).toEqual(openMarkets)
  })
})

import moment from 'moment'
import { List } from 'immutable'
import { MARKET_STAGES } from '../models/market'
import { REDUCER_ID } from '../reducers/market'
import { openMarketSelector } from '../selectors'
import aMarket from './builder/index.builder'

const openMarketTests = () => {
  describe('Market List Selector[openMarketSelector]', () => {
    it('should return 2 open markets if there backend only have two of three opened', () => {
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

    it('should return 0 open markets if there is there is one market but no open', () => {
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

    it('should return 0 open markets if there is no open markets loaded in store', () => {
      // GIVEN
      const markets = List([])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const openMarkets = openMarketSelector(reduxStore)

      // THEN
      expect(0).toEqual(openMarkets)
    })
  })
}

export default openMarketTests

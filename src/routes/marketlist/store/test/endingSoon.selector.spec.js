import moment from 'moment'
import { List } from 'immutable'
import { MARKET_STAGES } from '../models/market'
import { REDUCER_ID } from '../reducers/market'
import { endingSoonMarketSelector } from '../selectors'
import aMarket from './builder/index.builder'

const endingSoonTests = () => {
  describe('Market List Selector[endingSoonMarketSelector]', () => {
    it('should return 1 ending soon markets', () => {
      // GIVEN
      const aEndingSoonMarket = aMarket()
        .withDate(moment().add(3, 'days'))
        .withStage(MARKET_STAGES.MARKET_FUNDED)
        .get()

      const aClosedMarketViaStage = aMarket()
        .withDate(moment())
        .withStage(MARKET_STAGES.MARKET_CLOSED)
        .get()

      const anExpiredMarket = aMarket()
        .withDate(moment().subtract(1, 'days'))
        .get()

      const markets = List([aEndingSoonMarket, aClosedMarketViaStage, anExpiredMarket])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const endingSoonMarkets = endingSoonMarketSelector(reduxStore)

      // THEN
      expect(endingSoonMarkets).toEqual(1)
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
      const endingSoonMarkets = endingSoonMarketSelector(reduxStore)

      // THEN
      expect(0).toEqual(endingSoonMarkets)
    })

    it('should return 0 open markets if there is no open markets loaded in store', () => {
      // GIVEN
      const markets = List([])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const endingSoonMarkets = endingSoonMarketSelector(reduxStore)

      // THEN
      expect(0).toEqual(endingSoonMarkets)
    })
  })
}

export default endingSoonTests

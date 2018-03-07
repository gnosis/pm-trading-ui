import moment from 'moment'
import { List } from 'immutable'
import { MARKET_STAGES } from 'store/models'
import { REDUCER_ID } from 'store/reducers/market'
import { newMarketsSelector } from '../selectors'
import aMarket from './builder/index.builder'

const newMarketsTests = () => {
  describe('Market List Selector[newMarketsSelector]', () => {
    it('should return 1 new market if only one of three is new', () => {
      // GIVEN
      const aEndingSoonMarket = aMarket()
        .ofScalarType()
        .withCreation(moment().subtract(1, 'days'))
        .withResolution(moment().add(3, 'days'))
        .withStage(MARKET_STAGES.MARKET_FUNDED)
        .withResolved(false)
        .get()

      const aClosedMarketViaStage = aMarket()
        .ofCategoricalType()
        .withResolution(moment())
        .withStage(MARKET_STAGES.MARKET_CLOSED)
        .get()

      const anExpiredMarket = aMarket()
        .ofCategoricalType()
        .withResolution(moment().subtract(1, 'days'))
        .get()

      const markets = List([aEndingSoonMarket, aClosedMarketViaStage, anExpiredMarket])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const newMarkets = newMarketsSelector(reduxStore)

      // THEN
      expect(newMarkets).toEqual(1)
    })

    it('should return 0 new markets if there is there is one market but no open', () => {
      // GIVEN
      const aClosedMarket = aMarket()
        .ofScalarType()
        .withResolution(moment().subtract(1, 'M'))
        .withStage(MARKET_STAGES.MARKET_CLOSED)
        .get()

      const markets = List([aClosedMarket])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const newMarkets = newMarketsSelector(reduxStore)

      // THEN
      expect(0).toEqual(newMarkets)
    })

    it('should return 0 new markets if there is no new markets loaded in store', () => {
      // GIVEN
      const markets = List([])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const newMarkets = newMarketsSelector(reduxStore)

      // THEN
      expect(0).toEqual(newMarkets)
    })
  })
}

export default newMarketsTests

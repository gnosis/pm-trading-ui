import moment from 'moment'
import { List } from 'immutable'
import { MARKET_STAGES } from 'store/models'
import { REDUCER_ID } from 'store/reducers/market'
import { openMarketSelector } from '../selectors'
import aMarket from './builder/index.builder'

const openMarketTests = () => {
  describe('Market List Selector[openMarketSelector]', () => {
    it('should return 2 open markets if there backend only have two of three opened', () => {
      // GIVEN
      const aClosedMarketViaResolution = aMarket()
        .ofCategoricalType()
        .withResolution(moment().subtract(1, 'M'))
        .get()

      const aClosedMarketViaStage = aMarket()
        .ofCategoricalType()
        .withStage(MARKET_STAGES.MARKET_CLOSED)
        .get()

      const aClosedMarketViaResolved = aMarket()
        .ofCategoricalType()
        .withResolved(true)
        .get()

      const anOpenMarket = aMarket()
        .ofCategoricalType()
        .withResolved(false)
        .withResolution(moment().add(1, 'M'))
        .withStage(MARKET_STAGES.MARKET_FUNDED)
        .get()

      const markets = List([aClosedMarketViaResolution, aClosedMarketViaStage, aClosedMarketViaResolved, anOpenMarket])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const openMarkets = openMarketSelector(reduxStore)

      // THEN
      expect(openMarkets).toEqual(1)
    })

    it('should return 0 open markets if there is there is one market but no open', () => {
      // GIVEN
      const aClosedMarket = aMarket()
        .ofScalarType()
        .withResolution(moment().subtract(1, 'M'))
        .withStage(MARKET_STAGES.MARKET_CLOSED)
        .get()

      const markets = List([aClosedMarket])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const openMarkets = openMarketSelector(reduxStore)

      // THEN
      expect(0).toEqual(openMarkets)
    })

    it('should be closed if a market has stage 0 -> MARKET_CREATED', () => {
      // GIVEN
      const aClosedMarket = aMarket()
        .ofScalarType()
        .withResolution(moment().add(1, 'M'))
        .withStage(MARKET_STAGES.MARKET_CREATED)
        .withResolved(false)
        .get()

      const markets = List([aClosedMarket])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const openMarkets = openMarketSelector(reduxStore)

      // THEN
      expect(openMarkets).toEqual(0)
    })

    it('should return 0 open markets if there is no open markets loaded in store', () => {
      // GIVEN
      const markets = List([])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const openMarkets = openMarketSelector(reduxStore)

      // THEN
      expect(openMarkets).toEqual(0)
    })
  })
}

export default openMarketTests

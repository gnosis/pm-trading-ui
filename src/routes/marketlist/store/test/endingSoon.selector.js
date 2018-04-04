import moment from 'moment'
import { List } from 'immutable'
import { MARKET_STAGES } from 'store/models'
import { REDUCER_ID } from 'store/reducers/market'
import { endingSoonMarketSelector } from '../selectors'
import aMarket from './builder/index.builder'

const endingSoonTests = () => {
  describe('Market List Selector[endingSoonMarketSelector]', () => {
    it('should return 1 ending soon markets', () => {
      // GIVEN
      const aEndingSoonMarket = aMarket()
        .ofCategoricalType()
        .withResolution(moment().add(3, 'days').utc())
        .withStage(MARKET_STAGES.MARKET_FUNDED)
        .withResolved(false)
        .get()

      const aClosedMarketViaStage = aMarket()
        .ofScalarType()
        .withResolution(moment().utc())
        .withStage(MARKET_STAGES.MARKET_CLOSED)
        .get()

      const anExpiredMarket = aMarket()
        .ofCategoricalType()
        .withResolution(moment().subtract(1, 'days').utc())
        .withStage(MARKET_STAGES.MARKET_FUNDED)
        .withResolved(false)
        .get()

      const markets = List([aEndingSoonMarket, aClosedMarketViaStage, anExpiredMarket])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const endingSoonMarkets = endingSoonMarketSelector(reduxStore)

      // THEN
      expect(endingSoonMarkets).toEqual(1)
    })

    it('should return 0 ending soon markets if there is one market but not ending soon', () => {
      // GIVEN
      const aClosedMarket = aMarket()
        .ofScalarType()
        .withResolution(moment().subtract(1, 'M').utc())
        .withStage(MARKET_STAGES.MARKET_CLOSED)
        .get()

      const markets = List([aClosedMarket])
      const reduxStore = { [REDUCER_ID]: markets }

      // WHEN
      const endingSoonMarkets = endingSoonMarketSelector(reduxStore)

      // THEN
      expect(endingSoonMarkets).toEqual(0)
    })

    it('should return 0 ending soon markets if there is no ending soon markets loaded in store', () => {
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

import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { List } from 'immutable'
import marketReducer, { REDUCER_ID } from 'store/reducers/market'
import { processMarketResponse } from '../actions/fetchMarkets'
import { marketSelector } from '../selectors'
import { oneMarketData, twoMarketData, realData, MarketFactory } from './builder/index.builder'

const marketReducerTests = () => {
  describe('Market List Actions[fetchMarktes -> addMarkets]', () => {
    let store
    beforeEach(() => {
      const reducers = combineReducers({
        [REDUCER_ID]: marketReducer,
      })
      const middlewares = [
        thunk,
      ]
      const enhancers = [
        applyMiddleware(...middlewares),
      ]
      store = createStore(reducers, compose(...enhancers))
    })


    it('should return empty Immutable list when no markets are available', () => {
      // GIVEN
      const emptyResponse = { }

      // WHEN
      processMarketResponse(store.dispatch, emptyResponse)

      // THEN
      const emptyList = List([])
      const marketListState = marketSelector(store.getState())
      expect(marketListState).toEqual(emptyList)
    })

    it('should store list of markets when API GET succeded', () => {
      // GIVEN
      const threeMarketsResponse = realData

      // WHEN
      processMarketResponse(store.dispatch, threeMarketsResponse)

      // THEN
      const markets = marketSelector(store.getState())

      const firstMarketRecord = markets.get(0)
      const secondMarketRecord = markets.get(1)
      const thirdMarketRecord = markets.get(2)

      expect(firstMarketRecord).toEqual(MarketFactory.aKittiesMarket)
      expect(secondMarketRecord).toEqual(MarketFactory.aEthereumMarket)
      expect(thirdMarketRecord).toEqual(MarketFactory.aGasPriceMarket)
    })

    it('should replace markets in store when fetch data', () => {
      // GIVEN
      const kittiesResponse = oneMarketData
      processMarketResponse(store.dispatch, kittiesResponse)

      // WHEN
      const etherAndGasMarketsResponse = twoMarketData
      processMarketResponse(store.dispatch, etherAndGasMarketsResponse)

      // THEN
      const markets = marketSelector(store.getState())
      const firstMarketRecord = markets.get(0)
      const secondMarketRecord = markets.get(1)

      expect(store.getState().marketList.size).toEqual(2)
      expect(firstMarketRecord).toEqual(MarketFactory.aGasPriceMarket)
      expect(secondMarketRecord).toEqual(MarketFactory.aEthereumMarket)
    })
  })
}

export default marketReducerTests

import {
  combineReducers, createStore, applyMiddleware, compose,
} from 'redux'
import thunk from 'redux-thunk'
import { List } from 'immutable'
import marketReducer from 'store/reducers/market'
import blockchainReducer from 'store/reducers/blockchain'
import { processMarketsResponse } from 'store/actions/market'
import { marketListSelector } from '../selectors'
import {
  oneMarketData, twoMarketData, realData, MarketFactory,
} from './builder/index.builder'

const marketReducerTests = () => {
  describe('Market List Actions[fetchMarktes -> addMarkets]', () => {
    let store
    beforeEach(() => {
      const reducers = combineReducers({
        marketList: marketReducer,
        blockchain: blockchainReducer,
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
      processMarketsResponse(store.dispatch, store.getState(), emptyResponse)

      // THEN
      const emptyList = List([])
      const marketListState = marketListSelector(store.getState())
      expect(marketListState).toEqual(emptyList)
    })

    it('should store list of markets when API GET succeded', () => {
      // GIVEN
      const threeMarketsResponse = realData

      // WHEN
      processMarketsResponse(store.dispatch, store.getState(), threeMarketsResponse)

      // THEN
      const markets = marketListSelector(store.getState())

      const firstMarketRecord = markets.find(market => market.address === MarketFactory.aKittiesMarket.address)
      const secondMarketRecord = markets.find(market => market.address === MarketFactory.aEthereumMarket.address)
      const thirdMarketRecord = markets.find(market => market.address === MarketFactory.aGasPriceMarket.address)

      expect(firstMarketRecord).toEqual(MarketFactory.aKittiesMarket)
      expect(secondMarketRecord).toEqual(MarketFactory.aEthereumMarket)
      expect(thirdMarketRecord).toEqual(MarketFactory.aGasPriceMarket)
    })

    it('should replace markets in store when fetch data', () => {
      // GIVEN
      const kittiesResponse = oneMarketData
      processMarketsResponse(store.dispatch, store.getState(), kittiesResponse)

      // WHEN
      const etherAndGasMarketsResponse = twoMarketData
      processMarketsResponse(store.dispatch, store.getState(), etherAndGasMarketsResponse)

      // THEN
      const markets = marketListSelector(store.getState())
      const firstMarketRecord = markets.find(market => market.address === MarketFactory.aEthereumMarket.address)
      const secondMarketRecord = markets.find(market => market.address === MarketFactory.aGasPriceMarket.address)

      expect(store.getState().marketList.size).toEqual(2)
      expect(firstMarketRecord).toEqual(MarketFactory.aEthereumMarket)
      expect(secondMarketRecord).toEqual(MarketFactory.aGasPriceMarket)
    })
  })
}

export default marketReducerTests

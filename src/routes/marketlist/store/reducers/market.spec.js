import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { List } from 'immutable'
import { processMarketResponse } from '../actions/fetchMarkets'
import { MARKET_CATEGORICAL } from '../models'
import marketReducer, { REDUCER_ID } from './market'
import aMarket, { realData } from './market.builder'

describe('Market List Actions', () => {
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


  it('should return empty Immutable list when no markets are loaded', () => {
    // GIVEN
    const emptyResponse = { }

    // WHEN
    processMarketResponse(store.dispatch, emptyResponse)

    // THEN
    const emptyList = List([])
    const marketListState = store.getState().marketList
    expect(marketListState).toEqual(emptyList)
  })

  it('store list of markets when API GET succeded', () => {
    // GIVEN
    const threeMarketsResponse = realData

    const aKittiesMarket = aMarket()
      .withTitle('How much will Cryptokitties transactions make up of the entire Ethereum network transactions by December 29th, in the last 1500 blocks?')
      .withDate('2017-12-30T00:00:00')
      .withVolume('9523809523809680')
      .withType(MARKET_CATEGORICAL)
      .withOutcomes(undefined)
      .withBounds('1', '20', '%')
      .get()

    // WHEN
    processMarketResponse(store.dispatch, threeMarketsResponse)

    // THEN
    const firstMarketRecord = store.getState().marketList.get(0)
    expect(firstMarketRecord).toEqual(aKittiesMarket)
  })
})

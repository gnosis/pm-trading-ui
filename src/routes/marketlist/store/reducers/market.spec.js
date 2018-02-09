import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { List } from 'immutable'
import { processMarketResponse } from '../actions/fetchMarkets'
import { MARKET_CATEGORICAL, MARKET_SCALAR, OutcomeRecord } from '../models'
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


  it('should return empty Immutable list when no markets are available', () => {
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
      .withType(MARKET_SCALAR)
      .withOutcomes(undefined)
      .withBounds('1', '20', '%')
      .get()

    const aEthereumMarket = aMarket()
      .withTitle('What will the number of Ethereum transactions be on January 3rd, 2018?')
      .withDate('2018-01-03T12:00:00')
      .withVolume('857142857142872776')
      .withType(MARKET_SCALAR)
      .withOutcomes(undefined)
      .withBounds('500000', '1250000', 'Txs')
      .get()

    const gasOutcomes = List.of(
      new OutcomeRecord({ name: '<20 GWei', marginalPrice: '0.2287' }),
      new OutcomeRecord({ name: '20 GWei', marginalPrice: '0.3454' }),
      new OutcomeRecord({ name: '>20 GWei', marginalPrice: '0.4259' }),
    )
    const aGasPriceMarket = aMarket()
      .withTitle('What will be the median gas price on Feb. 1st, 2018?')
      .withDate('2018-02-01T12:00:00')
      .withVolume('342952380952380954')
      .withType(MARKET_CATEGORICAL)
      .withOutcomes(gasOutcomes)
      .withBounds(undefined, undefined, undefined)
      .get()

    // WHEN
    processMarketResponse(store.dispatch, threeMarketsResponse)

    // THEN
    const firstMarketRecord = store.getState().marketList.get(0)
    const secondMarketRecord = store.getState().marketList.get(1)
    const thirdMarketRecord = store.getState().marketList.get(2)
    expect(firstMarketRecord).toEqual(aKittiesMarket)
    expect(secondMarketRecord).toEqual(aEthereumMarket)
    expect(thirdMarketRecord).toEqual(aGasPriceMarket)
  })
})

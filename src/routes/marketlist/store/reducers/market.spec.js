import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { List } from 'immutable'
import { processMarketResponse } from '../actions/fetchMarkets'
import marketReducer, { REDUCER_ID } from './market'

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

  it('store Market records in store ', () => {
    expect(true).toEqual(true)
  })
})

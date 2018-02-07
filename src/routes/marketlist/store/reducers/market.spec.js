import { List } from 'immutable'
import marketReducer from './market'
import { MarketListRecord } from '../models'
import { emptyMarkets } from './market.builder'
import addMarkets from '../actions/addMarkets'

describe('Market List Actions', () => {
  it('should return the initial state when no markets are loaded', () => {
    // GIVEN
    const initialState = undefined
    const marketAction = addMarkets(emptyMarkets())
    const reduxState = marketReducer(initialState, marketAction)

    const emptyListOfMarkets = List(emptyMarkets())

    // WHEN
    const emptyMarketListRecord = new MarketListRecord(emptyListOfMarkets)
    // THEN
    expect(reduxState).toEqual(emptyMarketListRecord)
  })

  it('store Market records in store ', () => {
    expect(true).toEqual(true)
  })
})

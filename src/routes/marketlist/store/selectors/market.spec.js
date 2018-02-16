import { List } from 'immutable'
import { REDUCER_ID } from '../reducers/market'
import { marketSelector } from './index'

const marketTests = () => {
  it('get empty immutable List when they are not loaded', () => {
    // GIVEN
    const emptyList = List([])
    const reduxStore = { [REDUCER_ID]: emptyList }

    // WHEN
    const marketListState = marketSelector(reduxStore)

    // THEN
    expect(marketListState).toEqual(emptyList)
  })
}

export default marketTests

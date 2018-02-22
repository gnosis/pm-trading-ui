import { List } from 'immutable'
import { REDUCER_ID } from 'store/reducers/market'
import { marketListSelector } from '../selectors'

const marketTests = () => {
  describe('Market List Selector[marketSelector]', () => {
    it('should get empty immutable List when they are not loaded', () => {
      // GIVEN
      const emptyList = List([])
      const reduxStore = { [REDUCER_ID]: emptyList }

      // WHEN
      const marketListState = marketListSelector(reduxStore)

      // THEN
      expect(marketListState).toEqual(emptyList)
    })
  })
}

export default marketTests

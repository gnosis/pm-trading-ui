import { List } from 'immutable'
import { marketListSelector } from '../selectors'

const marketTests = () => {
  describe('Market List Selector[marketsSelector]', () => {
    it('should get empty immutable List when they are not loaded', () => {
      // GIVEN
      const emptyList = List([])
      const reduxStore = { marketList: emptyList }

      // WHEN
      const marketListState = marketListSelector(reduxStore)

      // THEN
      expect(marketListState).toEqual(emptyList)
    })
  })
}

export default marketTests

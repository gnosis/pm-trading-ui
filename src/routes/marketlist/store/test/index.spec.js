import marketReducerTests from './market.reducer.spec'
import marketTests from './market.selector.spec'
import openMarketTests from './openMarkets.selector.spec'
import endingSoonTests from './endingSoon.selector.spec'
import newMarketsTests from './newMarkets.selector.spec'

describe('Market List Test suite', () => {
  // ACTIONS AND REDUCERS
  marketReducerTests()

  // SELECTORS
  marketTests()
  openMarketTests()
  endingSoonTests()
  newMarketsTests()
})

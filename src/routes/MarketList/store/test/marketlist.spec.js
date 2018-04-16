import marketReducerTests from './market.reducer'
import marketTests from './market.selector'
import openMarketTests from './openMarkets.selector'
import endingSoonTests from './endingSoon.selector'
import newMarketsTests from './newMarkets.selector'

describe('Market List Test suite', () => {
  // ACTIONS AND REDUCERS
  marketReducerTests()

  // SELECTORS
  marketTests()
  openMarketTests()
  endingSoonTests()
  newMarketsTests()
})

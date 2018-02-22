import { createStructuredSelector } from 'reselect'

import {
  marketListSelector,
  newMarketsSelector,
  endingSoonMarketSelector,
  openMarketSelector,
} from '../store/selectors'

export default createStructuredSelector({
  markets: marketListSelector,
  openMarkets: openMarketSelector,
  newMarkets: newMarketsSelector,
  endingSoonMarkets: endingSoonMarketSelector,
})

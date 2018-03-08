import { List } from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import MarketOverview from './MarketOverview.jsx'
import Markets from './Markets.jsx'
import Filter from './Filter/index.jsx'
import MarketStats from './MarketStats.jsx'
import MarketsTitle from './MarketsTitle.jsx'
import NoMarkets from './NoMarkets.jsx'

// eslint-disable-next-line
const Layout = ({ markets, openMarkets, newMarkets, endingSoonMarkets, userAccount }) => (
  <div>
    <MarketsTitle />
    <MarketStats
      open={openMarkets}
      newMarkets={newMarkets}
      endingSoon={endingSoonMarkets}
    />
    <MarketOverview>
      <div className="col-md-9">
        { markets ? <Markets markets={markets} userAccount={userAccount} /> : <NoMarkets /> }
      </div>
      <div className="col-md-3">
        <Filter />
      </div>
    </MarketOverview>
  </div>
)


Layout.propTypes = {
  markets: PropTypes.instanceOf(List),
  userAccount: PropTypes.string,
  openMarkets: PropTypes.number.isRequired,
  newMarkets: PropTypes.number.isRequired,
  endingSoonMarkets: PropTypes.number.isRequired,
}

Layout.defaultProps = {
  markets: List([]),
  userAccount: undefined,
}

export default Layout

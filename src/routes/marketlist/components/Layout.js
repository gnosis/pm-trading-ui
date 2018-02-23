import { List } from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import Markets from './Markets.jsx'
import MarketsFilter from './MarketsFilter.jsx'
import MarketStats from './MarketStats.jsx'
import MarketsTitle from './MarketsTitle.jsx'
import NoMarkets from './NoMarkets.jsx'

// eslint-disable-next-line
const Layout = ({ markets, openMarkets, newMarkets, endingSoonMarkets, userAccount }) => (
  <div className="marketListPage">
    <MarketsTitle />
    <MarketStats
      open={openMarkets}
      newMarkets={newMarkets}
      endingSoon={endingSoonMarkets}
    />
    <div className="marketListPage__markets">
      <div className="container">
        <div className="row">
          <div className="marketList col-md-9">
            { markets ? <Markets markets={markets} userAccount={userAccount} /> : <NoMarkets /> }
          </div>
          <div className="marketList col-md-3">
            <MarketsFilter />
          </div>
        </div>
      </div>
    </div>
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

import PropTypes from 'prop-types'
import React from 'react'
import MarketStats from './MarketStats'

const MarketListTitle = () => (
  <div className="marketListPage__header">
    <div className="container">
      <h1>Market overview</h1>
    </div>
  </div>
)

const Layout = ({ openMarkets, newMarkets, endingSoonMarkets }) => (
  <div className="marketListPage">
    <MarketListTitle />
    <MarketStats
      open={openMarkets}
      newMarkets={newMarkets}
      endingSoon={endingSoonMarkets}
    />
    <div className="marketListPage__markets">
      <div className="container">
        <div className="row">
          {/* this.renderMarkets()}
          {this.renderMarketFilter() */}
        </div>
      </div>
    </div>
  </div>
)


Layout.propTypes = {
  openMarkets: PropTypes.number.isRequired,
  newMarkets: PropTypes.number.isRequired,
  endingSoonMarkets: PropTypes.number.isRequired,
}


export default Layout

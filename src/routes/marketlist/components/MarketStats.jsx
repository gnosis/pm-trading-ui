import PropTypes from 'prop-types'
import React from 'react'

const Stat = ({ name, value }) => (
  <div className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-0 marketStats__stat">
    <div className="marketStats__icon icon icon--market" />
    <span className="marketStats__value">{value}</span>
    <div className="marketStats__label">{name}</div>
  </div>
)

Stat.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}

const MarketStats = ({ open, newMarkets, endingSoon }) => (
  <div className="marketListPage__stats">
    <div className="container">
      <div className="row marketStats">
        <Stat name="Open Markets" value={open} />
        <Stat name="Ending Soon" value={endingSoon} />
        <Stat name="New Markets" value={newMarkets} />
      </div>
    </div>
  </div>
)

MarketStats.propTypes = {
  open: PropTypes.number.isRequired,
  newMarkets: PropTypes.number.isRequired,
  endingSoon: PropTypes.number.isRequired,
}

export default MarketStats

import CurrencyName from 'components/CurrencyName'
import PropTypes from 'prop-types'
import React from 'react'

const MarketTrading = ({ volume, collateralToken }) => (
  <div className="info__field">
    <div className="info__field--icon icon icon--currency" />
    <div className="info__field--label">
      {volume}&nbsp;
      <CurrencyName collateralToken={collateralToken} />&nbsp; Volume
    </div>
  </div>
)

MarketTrading.propTypes = {
  volume: PropTypes.string.isRequired,
  collateralToken: PropTypes.string.isRequired,
}

export default MarketTrading

import PropTypes from 'prop-types'
import React from 'react'

const MarketResolution = ({ resolution }) => (
  <div className="info__field">
    <div className="info__field--icon icon icon--enddate" />
    <div className="info__field--label">
      {resolution}
    </div>
  </div>
)

MarketResolution.propTypes = {
  resolution: PropTypes.string.isRequired,
}

export default MarketResolution

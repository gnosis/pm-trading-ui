import React from 'react'
import PropTypes from 'prop-types'

import './marketSidebar.scss'

const MarketSidebar = ({ fields }) => (
  <div className="marketSidebar">
    {Object.keys(fields || {}).map(key => <p key={key}>{key}</p>)}
  </div>
)


MarketSidebar.propTypes = {
  fields: PropTypes.objectOf(PropTypes.string),
}

export default MarketSidebar

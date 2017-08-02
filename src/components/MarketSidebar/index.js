import React from 'react'
import PropTypes from 'prop-types'

import './marketSidebar.less'

const MarketSidebar = ({ fields }) => (
  <div className="marketSidebar">
    {Object.keys(fields || {}).map(key => <p key={key}>{key}</p>)}
  </div>
)


MarketSidebar.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string),
}

export default MarketSidebar

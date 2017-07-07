import React, { Component } from 'react'

import './marketSidebar.less'

class MarketSidebar extends Component {
  render() {
    const { fields } = this.props
    
    return (
      <div className="marketSidebar">
        {Object.keys(fields || {}).map((key) => {
          return <p key={key}>{key}</p>
        })}
      </div>
    )
  }
}

export default MarketSidebar

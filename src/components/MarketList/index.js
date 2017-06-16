import React, { Component } from 'react'

import './marketList.less'

export default class MarketList extends Component {
  renderMarkets() {
    const { markets } = this.props

    if (markets.length > 0) {
      const marketList = markets.map(market => (
        <div className="market">
          <div className="market__eventTitle">{market.eventTitle}</div>
          <div className="market__resolutionDate">{market.resolutionDate}</div>
        </div>
      ))

      return <div className="markets">{marketList}</div>
    }

    return undefined
  }

  render() {
    return (
      <div className="marketListPage">
        { this.renderMarkets() && <div className="markets">No Markets available</div> }
      </div>
    )
  }
}

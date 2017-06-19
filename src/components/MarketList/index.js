import React, { Component } from 'react'

import moment from 'moment'

import ResolutionTimer from 'components/RelativeTime'

import './marketList.less'

export default class MarketList extends Component {
  componentWillMount() {
    this.props.requestMarkets()
  }

  renderMarkets() {
    const { markets } = this.props

    if (markets.length > 0) {
      const marketList = markets.map(market => (
        <div className="market" key={market.id}>
          <div className="market__header">{market.eventDescription.title}</div>
          <div className="market__resolutionDateRelative">
            <ResolutionTimer target={market.eventDescription.resolutionDate} />
          </div>
          <div className="market__creator">{market.creator}</div>
          <div className="market__oracle">{market.oracle.owner}</div>
          <div className="market_resolutionDate">
            {moment(market.eventDescription.resolutionDate).local().format('LLL')}
          </div>
        </div>
      ))

      return <div className="marketList">{marketList}</div>
    }
    return (
      <div className="marketList">
        <div className="market">No Markets available</div>
      </div>
    )
  }

  renderMarketFilter() {
    return (
      <div className="marketFilter">
        <div className="marketFilter__input">
          <label>Preset</label>
          <select></select>
        </div>
        <div className="marketFilter__input">
          <label>OracleType</label>
          <select></select>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="marketListPage">
        <div className="marketOverview">
          <h1>Marketoverview</h1>
          <p>Here you can see all the markets!</p>

          <div className="marketStats">
            <p className="marketStats__stat">200 markets open</p>
            <p className="marketStats__stat">2 closing soon</p>
            <p className="marketStats__stat">5 new (since last visit)</p>
          </div>
        </div>
        { this.renderMarketFilter() }
        { this.renderMarkets() }
      </div>
    )
  }
}

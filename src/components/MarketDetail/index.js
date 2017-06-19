import React, { Component } from 'react'
import moment from 'moment'
import 'moment-duration-format'

import { RESOLUTION_TIME } from 'utils/constants'

import './marketDetail.less'

export default class MarketDetail extends Component {
  componentWillMount() {
    this.props.requestMarket(this.props.params.id)
  }

  renderLoading() {
    return (
      <div className="marketDetailPage">
        Loading...
      </div>
    )
  }

  renderInfos() {
    const { market } = this.props

    const keyValueInfo = {
      Creator: market.event.creator,
      Oracle: market.oracle.id,
      Token: market.event.collateralToken,
      Fee: market.fee.toFixed(2),
      Funding: `${market.funding.toFixed(2)} ${market.event.collateralToken}`,
    }

    return (
      <div className="marketInfos col-xs-2">
        {Object.keys(keyValueInfo).map(label => (
          <div className="marketInfo" key={label}>
            <p className="marketInfo__info marketInfo__info--value">{keyValueInfo[label]}</p>
            <p className="marketInfo__info marketInfo__info--label">{label}</p>
          </div>
        ))}
      </div>
    )
  }

  renderControls() {
    const { market } = this.props

    return (
      <div className="marketControls">
        <div className="row">
          <button
            type="button"
            className="marketControls__button btn btn-primary col-xs-2"
          >
            Buy Shares
          </button>
          <button
            type="button"
            className="marketControls__button btn btn-primary col-xs-2"
          >
            Short Sell
          </button>
          <button
            type="button"
            className="marketControls__button btn btn-default col-xs-2"
          >
            My Shares
          </button>
          <button
            type="button"
            className="marketControls__button btn btn-default col-xs-2"
          >
            Resolve
          </button>
        </div>
      </div>
    )
  }

  renderTimer() {
    const { market } = this.props

    const timeUntilEvent = moment
      .duration(moment(market.eventDescription.resolutionDate)
      .diff())

    return (
      <div className="marketTimer">
        <div className="marketTimer__live">
          {timeUntilEvent.format(RESOLUTION_TIME.RELATIVE_LONG_FORMAT)}
        </div>
        <small className="marketTime__absolute">
          {moment(market.eventDescription.resolutionDate).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
        </small>
      </div>
    )
  }

  render() {
    const { market } = this.props

    if (!market) {
      return this.renderLoading()
    }

    return (
      <div className="marketDetailPage">
        <div className="row">
          <div className="marketDetails col-xs-10">
            <h1>{ market.eventDescription.title }</h1>
            <p>{ market.eventDescription.description }</p>
            { this.renderTimer() }
          </div>
          { this.renderInfos() }
          { this.renderControls() }
        </div>
      </div>
    )
  }
}

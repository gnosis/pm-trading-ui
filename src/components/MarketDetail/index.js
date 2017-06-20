import React, { Component } from 'react'
import moment from 'moment'
import 'moment-duration-format'

import { RESOLUTION_TIME } from 'utils/constants'

import './marketDetail.less'

const EXPAND_BUY_SHARES = 'BUY_SHARES'
const EXPAND_SHORT_SELL = 'SHORT_SELL'
const EXPAND_MY_SHARES = 'MY_SHARES'
const EXPAND_RESOLVE = 'RESOLVE'

export default class MarketDetail extends Component {
  componentWillMount() {
    this.props.requestMarket(this.props.params.id)
  }

  handleExpand = (type) => {

  }

  renderLoading() {
    return (
      <div className="marketDetailPage">
        Loading...
      </div>
    )
  }

  renderInfos(market) {
    const keyValueInfo = {
      Creator: market.marketCreator,
      Oracle: market.oracleOwner,
      Token: market.collateralToken,
      Fee: market.fee.toFixed(2),
      Funding: `${market.funding.toFixed(2)} ${market.collateralToken}`,
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

  renderDetails(market) {

    return (
      <div className="marketDetails col-xs-10">
        <p>{ market.description }</p>
      </div>
    )
  }

  renderControls(market) {
    return (
      <div className="marketControls">
        <div className="row">
          <button
            type="button"
            className="marketControls__button btn btn-primary col-xs-2"
            onClick={() => this.handleExpand(EXPAND_BUY_SHARES)}
          >
            Buy Shares
          </button>
          <button
            type="button"
            className="marketControls__button btn btn-primary col-xs-2"
            onClick={() => this.handleExpand(EXPAND_SHORT_SELL)}
          >
            Short Sell
          </button>
          <button
            type="button"
            className="marketControls__button btn btn-default col-xs-2"
            onClick={() => this.handleExpand(EXPAND_MY_SHARES)}
          >
            My Shares
          </button>
          <button
            type="button"
            className="marketControls__button btn btn-default col-xs-2"
            onClick={() => this.handleExpand(EXPAND_RESOLVE)}
          >
            Resolve
          </button>
        </div>
      </div>
    )
  }

  renderTimer(market) {
    const timeUntilEvent = moment
      .duration(moment(market.resolutionDate)
      .diff())

    return (
      <div className="marketTimer col-xs-10">
        <div className="marketTimer__live">
          {timeUntilEvent.format(RESOLUTION_TIME.RELATIVE_LONG_FORMAT)}
        </div>
        <small className="marketTime__absolute">
          {moment(market.resolutionDate).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
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
          <div className="col-xs-12">
            <h1>{ market.title }</h1>
          </div>
        </div>
        <div className="row">
          { this.renderDetails(market) }
          { this.renderInfos(market) }
          { this.renderTimer(market) }
        </div>
        <div className="row">
          { this.renderControls(market) }
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react'
import moment from 'moment'
import _ from 'lodash'
import 'moment-duration-format'
import autobind from 'autobind-decorator'

import { RESOLUTION_TIME } from 'utils/constants'
import Expandable from 'components/Expandable'
import MarketGraph from 'components/MarketGraph'

import './marketDetail.less'

const EXPAND_BUY_SHARES = 'BUY_SHARES'
const EXPAND_SHORT_SELL = 'SHORT_SELL'
const EXPAND_MY_SHARES = 'MY_SHARES'
const EXPAND_RESOLVE = 'RESOLVE'

// start debug history
const generateRandomGraph = () => {
  const startDate = moment().subtract(4, 'month')
  const endDate = moment()
  const curDate = startDate.clone()

  const graphData = []
  let i = 0

  let dir = 0
  let dirChangeForce = 0.0001

  while (endDate.diff(curDate) > 0) {
    curDate.add(12, 'hour')

    dir = dir + (dirChangeForce * Math.random())

    let outcome1 = Math.min(dir * 50, 1)

    graphData.push({ date: curDate.toDate(), outcome1, outcome2: 1 - outcome1 })
  }

  return graphData
}

const testData = generateRandomGraph()
// end debug history


const controlButtons = {
  [EXPAND_BUY_SHARES]: {
    label: 'Buy Shares',
    className: 'btn btn-primary',
    component: <span>Buy Shares</span>,
  },
  [EXPAND_SHORT_SELL]: {
    label: 'Short Sell',
    className: 'btn btn-primary',
    component: <span>Short Sell</span>,
  },
  [EXPAND_MY_SHARES]: {
    label: 'My Shares',
    className: 'btn btn-default',
    component: <span>My Shares</span>,
  },
  [EXPAND_RESOLVE]: {
    label: 'Resolve',
    className: 'btn btn-default',
    component: <span>Resolve</span>,
  },
}

export default class MarketDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      expandableSelected: undefined,
    }
  }
  componentWillMount() {
    this.props.requestMarket(this.props.params.id)
  }

  @autobind
  handleExpand(type) {
    // Toggle
    this.setState({ expandableSelected: (this.state.expandableSelected === type ? null : type) })
  }

  renderLoading() {
    return (
      <div className="marketDetailPage">
        Loading...
      </div>
    )
  }

  renderExpandableContent() {
    return (
      <Expandable
        selected={this.state.expandableSelected}
        components={_.mapValues(controlButtons, control => control.component)}
      />
    )
  }

  renderInfos(market) {
    const infos = {
      Creator: market.creator,
      Oracle: market.oracleOwner,
      Token: market.collateralToken,
      Fee: market.fee.toFixed(2),
      Funding: `${market.funding.toFixed(2)} ${market.collateralToken}`,
    }

    return (
      <div className="marketInfos col-xs-2">
        {Object.keys(infos).map(label => (
          <div className="marketInfo" key={label}>
            <p className="marketInfo__info marketInfo__info--value">{infos[label]}</p>
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
      <div className="marketControls container">
        <div className="row">
          {Object.keys(controlButtons).map(type => (
            <button
              key={type}
              type="button"
              className={`
                marketControls__button
                ${controlButtons[type].className}
                col-xs-2
                ${type === this.state.expandableSelected ? 'marketControls__button--active' : ''}`
              }
              onClick={() => this.handleExpand(type)}
            >
              {controlButtons[type].label}
            </button>
          ))}
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

    if (!market.address) {
      return this.renderLoading()
    }

    return (
      <div className="marketDetailPage">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <h1>{ market.title }</h1>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            { this.renderDetails(market) }
            { this.renderInfos(market) }
            { this.renderTimer(market) }
          </div>
        </div>
        { this.renderControls(market) }
        { this.renderExpandableContent() }
        <div className="marketGraphContainer">
          <div className="container">
            <MarketGraph data={testData} />
          </div>
        </div>
      </div>
    )
  }
}

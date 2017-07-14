import React, { Component } from 'react'
import { mapValues } from 'lodash'
import moment from 'moment'
import 'moment-duration-format'
import autobind from 'autobind-decorator'

import { RESOLUTION_TIME } from 'utils/constants'
import MarketGraph from 'components/MarketGraph'

import MarketBuySharesForm from 'components/MarketBuySharesForm'

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
    component: MarketBuySharesForm,
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
    this.setState({ visibleControl: (this.state.visibleControl === type ? null : type) })
  }

  renderLoading() {
    return (
      <div className="marketDetailPage">
        Loading...
      </div>
    )
  }

  renderExpandableContent() {
    const { visibleControl } = this.state

    if (visibleControl === EXPAND_BUY_SHARES) {
      const {
        market,
        selectedCategoricalOutcome,
        selectedBuyInvest,
        buyShares
      } = this.props

      return (
        <MarketBuySharesForm
          {...{
            market,
            selectedCategoricalOutcome,
            selectedBuyInvest,
            buyShares,
          }}
        />
      )
    }
  }

  renderInfos(market) {
    const infos = {
      Creator: market.creator,
      Oracle: market.oracle.owner,
      Token: market.event.collateralToken,
      Fee: market.fee.toFixed(2),
      Funding: `${market.funding} ${market.event.collateralToken}`,
    }

    return (
      <div className="marketInfos col-md-2">
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
      <div className="marketDetails col-md-10">
        <p>{ market.eventDescription.description }</p>
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
                col-md-2
                ${type === this.state.visibleControl ? 'marketControls__button--active' : ''}`
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
      .duration(moment(market.event.resolutionDate)
      .diff())

    return (
      <div className="marketTimer col-md-10">
        <div className="marketTimer__live">
          {timeUntilEvent.format(RESOLUTION_TIME.RELATIVE_LONG_FORMAT)}
        </div>
        <small className="marketTime__absolute">
          {moment(market.event.resolutionDate).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
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
            <div className="col-md-10">
              <h1>{ market.eventDescription.title }</h1>
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
        <div className="expandable">
          <div className="container">
            { this.renderExpandableContent() }
          </div>
        </div>
        <MarketGraph data={testData} />
      </div>
    )
  }
}

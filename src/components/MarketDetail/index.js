import React, { Component } from 'react'
import { mapValues } from 'lodash'
import moment from 'moment'
import 'moment-duration-format'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'

import { RESOLUTION_TIME } from 'utils/constants'
import MarketGraph from 'components/MarketGraph'

import MarketBuySharesForm from 'components/MarketBuySharesForm'
import MarketResolveForm from 'components/MarketResolveForm'
import MarketMySharesForm from 'components/MarketMySharesForm'

import './marketDetail.less'

const EXPAND_BUY_SHARES = 'buy-shares'
const EXPAND_SHORT_SELL = 'short-sell'
const EXPAND_MY_SHARES = 'my-shares'
const EXPAND_RESOLVE = 'resolve'

// start debug history
const generateRandomGraph = () => {
  const startDate = moment().subtract(4, 'month')
  const endDate = moment()
  const curDate = startDate.clone()

  const graphData = []
  const i = 0

  let dir = 0
  const dirChangeForce = 0.0001

  while (endDate.diff(curDate) > 0) {
    curDate.add(12, 'hour')

    dir += (dirChangeForce * Math.random())

    const outcome1 = Math.min(dir * 50, 1)

    graphData.push({ date: curDate.toDate(), outcome1, outcome2: 1 - outcome1 })
  }

  return graphData
}

const testData = generateRandomGraph()
// end debug history


const expandableViews = {
  [EXPAND_BUY_SHARES]: {
    label: 'Buy Shares',
    className: 'btn btn-primary',
    component: MarketBuySharesForm,
  },
  [EXPAND_SHORT_SELL]: {
    label: 'Short Sell',
    className: 'btn btn-primary',
    component: undefined,
  },
  [EXPAND_MY_SHARES]: {
    label: 'My Holdings',
    className: 'btn btn-default',
    component: MarketMySharesForm,
  },
  [EXPAND_RESOLVE]: {
    label: 'Resolve',
    className: 'btn btn-default',
    component: MarketResolveForm,
    showCondition: (marketComponent, market) => marketComponent.props.defaultAccount === market.owner && !market.oracle.isOutcomeSet,
  },
}

export default class MarketDetail extends Component {
  componentWillMount() {
    if (!this.props.market || !this.props.market.address) {
      this.props.fetchMarket(this.props.params.id)
    }

    if(this.props.defaultAccount && (!this.props.market || !this.props.market.shares)) {
      this.props.fetchMarketShares(this.props.defaultAccount)
    }
  }

  @autobind
  handleExpand(view) {
    const currentView = this.props.params.view

    if (currentView === view) {
      this.props.changeUrl(`markets/${this.props.params.id}`)
    } else {
      this.props.changeUrl(`markets/${this.props.params.id}/${view}`)
    }
  }

  renderLoading() {
    return (
      <div className="marketDetailPage">
        <div className="container">Loading...</div>
      </div>
    )
  }

  renderExpandableContent() {
    const currentView = this.props.params.view

    if (currentView && expandableViews[currentView] && expandableViews[currentView].component) {
      const view = expandableViews[currentView]
      const ViewComponent = view.component

      // Not sure if this is a good idea; If I need to optimize, here's a good place to start
      return 
        <div className="expandable__inner">
          <div className="container">
            <ViewComponent {...this.props} />
          </div>
        </div>
    }

    return <div />
  }

  renderInfos(market) {
    const infos = {
      Creator: market.creator,
      Oracle: market.oracle.owner,
      Token: market.event.collateralToken,
      Fee: Decimal(market.fee || 0).toFixed(2),
      Funding: `${Decimal(market.funding || 0).toFixed(4)} ${market.event.collateralToken}`,
    }

    return (
      <div className="marketInfos col-md-3">
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
    const timeUntilEvent = moment
      .duration(moment(market.event.resolutionDate)
      .diff())

    return (
      <div className="marketDetails col-md-9">
        <div className="marketDescription">
          <p className="marketDescription__text">{ market.eventDescription.description }</p>
        </div>
        <div className="marketTimer">
          <div className="marketTimer__live">
            {timeUntilEvent.format(RESOLUTION_TIME.RELATIVE_LONG_FORMAT)}
          </div>
          <small className="marketTime__absolute">
            {moment(market.event.resolutionDate).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
          </small>
        </div>
      </div>
    )
  }

  renderControls(market) {
    return (
      <div className="marketControls container">
        <div className="row">
          {Object.keys(expandableViews).filter(view =>
            !expandableViews[view].showCondition || expandableViews[view].showCondition(this, market),
          ).map(view => (
            <button
              key={view}
              type="button"
              className={`
                marketControls__button
                ${expandableViews[view].className}
                ${view === this.props.params.view ? 'marketControls__button--active' : ''}`
              }
              onClick={() => this.handleExpand(view)}
            >
              {expandableViews[view].label}
            </button>
          ))}
        </div>
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
            <div className="col-md-6">
              <h1 className="marketTitle__heading">{ market.eventDescription.title }</h1>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            { this.renderDetails(market) }
            { this.renderInfos(market) }
          </div>
        </div>
        { this.renderControls(market) }
        <div className="expandable">
          { this.renderExpandableContent() }
        </div>
        <MarketGraph data={testData} />
      </div>
    )
  }
}

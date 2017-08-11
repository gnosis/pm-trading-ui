import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment-duration-format'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'

import { RESOLUTION_TIME } from 'utils/constants'


import { collateralTokenToText } from 'components/CurrencyName'
import { decimalToText } from 'components/DecimalValue'

import Countdown from 'components/Countdown'

import MarketGraph from 'components/MarketGraph'

import MarketBuySharesForm from 'components/MarketBuySharesForm'
import MarketResolveForm from 'components/MarketResolveForm'
import MarketMySharesForm from 'components/MarketMySharesForm'
// import MarketShortSellForm from 'components/MarketShortSellForm'
import MarketMyTrades from 'components/MarketMyTrades'

import './marketDetail.less'

const EXPAND_BUY_SHARES = 'buy-shares'
// const EXPAND_SHORT_SELL = 'short-sell'
const EXPAND_MY_TRADES = 'my-trades'
const EXPAND_MY_SHARES = 'my-shares'
const EXPAND_RESOLVE = 'resolve'

// start debug history
const generateRandomGraph = () => {
  const startDate = moment().subtract(4, 'month')
  const endDate = moment()
  const curDate = startDate.clone()

  const graphData = []

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
    showCondition: props =>
      props.market &&
      props.defaultAccount &&
      props.defaultAccount !== props.market.owner &&
      !props.market.oracle.isOutcomeSet,
  },
  /* HIDDEN
  [EXPAND_SHORT_SELL]: {
    label: 'Short Sell',
    className: 'btn btn-primary',
    component: MarketShortSellForm,
    showCondition: props =>    
      props.market &&
      props.defaultAccount &&      
      !props.market.oracle.isOutcomeSet &&
      props.market.eventDescription.outcomes &&
      props.market.eventDescription.outcomes.length > 2,
  },*/
  [EXPAND_MY_SHARES]: {
    label: 'My Holdings',
    className: 'btn btn-default',
    component: MarketMySharesForm,
    showCondition: props =>
      props.market &&
      props.defaultAccount &&
      props.defaultAccount !== props.market.owner,
  },
  [EXPAND_MY_TRADES]: {
    label: 'My Trades',
    className: 'btn btn-default',
    component: MarketMyTrades,
    showCondition: props =>
      props.market &&
      props.defaultAccount &&
      props.defaultAccount !== props.market.owner,
  },
  [EXPAND_RESOLVE]: {
    label: 'Resolve',
    className: 'btn btn-default',
    component: MarketResolveForm,
    showCondition: props =>
      props.market &&
      props.defaultAccount &&
      !props.market.oracle.isOutcomeSet,
  },
}

class MarketDetail extends Component {
  componentWillMount() {
    if (!this.props.market || !this.props.market.address) {
      this.props.fetchMarket(this.props.params.id)
    }

    if (this.props.defaultAccount && (!this.props.market || !this.props.market.shares)) {
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

      if (typeof view.showCondition !== 'function' || view.showCondition(this.props)) {
        const ViewComponent = view.component

        // Not sure if this is a good idea; If I need to optimize, here's a good place to start
        return (
          <div className="expandable__inner">
            <div className="container">
              <ViewComponent {...this.props} />
            </div>
          </div>
        )
      }
    }

    return <div />
  }

  renderInfos(market) {
    const infos = {
      Creator: market.creator,
      Oracle: market.oracle.owner,
      Token: collateralTokenToText(market.event.collateralToken),
      Fee: `${decimalToText(market.fee, 4)} %`,
      Funding: `${decimalToText(Decimal(market.funding).div(1e18))} ${collateralTokenToText(market.event.collateralToken)}`,
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
    return (
      <div className="marketDetails col-md-9">
        <div className="marketDescription">
          <p className="marketDescription__text">{ market.eventDescription.description }</p>
        </div>
        <div className="marketTimer">
          <div className="marketTimer__live">
            <Countdown target={market.eventDescription.resolutionDate} />
          </div>
          <small className="marketTime__absolute">
            {moment(market.eventDescription.resolutionDate).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
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
            typeof expandableViews[view].showCondition !== 'function' ||
            expandableViews[view].showCondition(this.props, market),
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

MarketDetail.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string,
    view: PropTypes.string,
  }),
  defaultAccount: PropTypes.string,
  market: PropTypes.object,
  changeUrl: PropTypes.func,
  fetchMarket: PropTypes.func,
  fetchMarketShares: PropTypes.func,
}

export default MarketDetail

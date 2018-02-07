import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment-duration-format'
import autobind from 'autobind-decorator'
import cn from 'classnames'
import Decimal from 'decimal.js'

import { RESOLUTION_TIME, GAS_COST, MIN_CONSIDER_VALUE } from 'utils/constants'
import { marketShape, marketShareShape, marketTradeShape, gasCostsShape } from 'utils/shapes'
import { weiToEth, isMarketClosed, isMarketResolved } from 'utils/helpers'

import InteractionButton from 'containers/InteractionButton'

import { collateralTokenToText } from 'components/CurrencyName'
import DecimalValue, { decimalToText } from 'components/DecimalValue'
import LoadingIndicator from 'components/LoadingIndicator'
import Countdown from 'components/Countdown'
import Outcome from 'components/Outcome'
import MarketGraph from 'components/MarketGraph'

import config from 'config.json'
import expandableViews, { EXPAND_MY_SHARES } from './ExpandableViews'

import './marketDetail.scss'

const ONE_WEEK_IN_HOURS = 168

class MarketDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      marketFetchError: undefined,
    }
  }

  componentWillMount() {
    this.fetchEssentialData(!this.props.match.params.view)
    this.fetchDataTimer = setInterval(this.fetchEssentialData, config.fetchMarketTimeInterval)
  }

  componentDidMount() {
    this.scrollToSharesDiv()
  }

  componentWillUnmount() {
    clearInterval(this.fetchDataTimer)
  }

  @autobind
  getAvailableView() {
    return Object.keys(expandableViews).find(view => expandableViews[view].showCondition(this.props))
  }

  scrollToSharesDiv = () => {
    const { pathname } = this.props.location
    const isMySharesView = pathname.indexOf(EXPAND_MY_SHARES) !== -1
    const shouldScroll = this.divSharesNode && isMySharesView
    if (shouldScroll) {
      const y = this.divSharesNode.offsetTop
      window.scrollTo(0, y)
    } else {
      window.scrollTo(0, 0)
    }
  }

  // Check available views on first fetch
  @autobind
  fetchEssentialData(firstFetch = false) {
    this.props
      .fetchMarket()
      .then(() => {
        this.props.requestGasCost(GAS_COST.REDEEM_WINNINGS, { eventAddress: this.props.market.event.address })
        this.props.fetchMarketTrades(this.props.market)

        if (firstFetch) {
          const availableView = this.getAvailableView()
          if (availableView) {
            this.props.changeUrl(`/markets/${this.props.match.params.id}/${availableView}`)
          }
        }
      })
      .catch((err) => {
        this.setState({
          marketFetchError: err,
        })
      })

    if (this.props.hasWallet) {
      this.props.requestGasCost(GAS_COST.BUY_SHARES)
      this.props.requestGasCost(GAS_COST.SELL_SHARES)
    }

    if (this.props.defaultAccount && this.props.match.params.id !== undefined) {
      this.props.fetchMarketTradesForAccount(this.props.defaultAccount)
      this.props.fetchMarketShares(this.props.defaultAccount)
    }

    this.props.requestGasPrice()
  }

  @autobind
  handleExpand(view) {
    if (this.props.match.params.view !== view) {
      this.props.changeUrl(`/markets/${this.props.match.params.id}/${view}`)
    } else {
      this.props.changeUrl(`/markets/${this.props.match.params.id}/`)
    }
  }

  @autobind
  handleRedeemWinnings() {
    return this.props.redeemWinnings(this.props.market)
  }

  renderLoading() {
    return (
      <div className="marketDetailPage">
        <div className="container">Loading...</div>
      </div>
    )
  }

  renderExpandableContent() {
    const currentView = this.props.match.params.view || false
    if (currentView && expandableViews[currentView] && expandableViews[currentView].component) {
      const view = expandableViews[currentView]

      if (typeof view.showCondition !== 'function' || view.showCondition(this.props)) {
        const ViewComponent = view.component
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
      Token: collateralTokenToText(market.event.collateralToken),
      Fee: `${decimalToText(market.fee, 2) / 10000} %`,
      Funding: `${decimalToText(Decimal(market.funding).div(1e18))} ${collateralTokenToText(market.event.collateralToken)}`,
      'Trading Volume': `${decimalToText(Decimal(market.tradingVolume).div(1e18))} ${collateralTokenToText(market.event.collateralToken)}`,
    }
    const showWithdrawFees =
      this.props.defaultAccount &&
      market.oracle.owner === this.props.defaultAccount &&
      new Decimal(market.collectedFees).gt(0)

    if (this.props.isOnWhitelist) {
      // Show creator String
      infos.creator = this.props.moderators[market.creator] || market.creator
    }

    if (showWithdrawFees) {
      infos['Earnings through market fees'] = `${decimalToText(weiToEth(market.collectedFees))} ${collateralTokenToText(market.event.collateralToken)}`
    }

    return (
      <div className="marketInfos col-xs-10 col-xs-offset-1 col-sm-3 col-sm-offset-0">
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
    const timeToResolution = moment
      .utc(market.eventDescription.resolutionDate)
      .local()
      .diff(moment(), 'hours')
    const { marketShares, gasCosts: { redeemWinnings: redeemWinningsGasCost }, gasPrice } = this.props
    const winningsTotal = Object.keys(marketShares).reduce(
      (acc, shareId) => acc.add(Decimal(marketShares[shareId].winnings || '0')),
      Decimal(0),
    )
    const marketClosed = isMarketClosed(market)
    const marketResolved = isMarketResolved(market)
    const showWinning = marketResolved
    const marketClosedOrFinished = marketClosed || marketResolved
    const marketStatus = marketResolved ? 'resolved.' : 'closed.'
    const showCountdown = !marketClosedOrFinished && timeToResolution < ONE_WEEK_IN_HOURS
    const redeemWinningsTransactionGas = gasPrice
      .mul(redeemWinningsGasCost || 0)
      .div(1e18)
      .toDP(5, 1)
      .toString()

    return (
      <div className="marketDetails col-xs-10 col-xs-offset-1 col-sm-9 col-sm-offset-0">
        <div className="marketDescription">
          <p className="marketDescription__text">{market.eventDescription.description}</p>
        </div>
        <Outcome market={market} />
        {showCountdown ? (
          <div className="marketTimer">
            <div className="marketTimer__live">
              <Countdown target={market.eventDescription.resolutionDate} />
            </div>
            <small className="marketTime__absolute">
              {moment
                .utc(market.eventDescription.resolutionDate)
                .local()
                .format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
            </small>
          </div>
        ) : (
          <div className="marketTimer">
            <div className="marketTimer__live marketTimer__live--big">
              <div className="marketTimer__liveLabel">Resolution Time</div>
            </div>
            <div className="marketTimer__live">
              {moment
                .utc(market.eventDescription.resolutionDate)
                .local()
                .format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
            </div>
            {marketClosedOrFinished && (
              <div className="marketTimer__marketClosed">{`This market was ${marketStatus}`}</div>
            )}
          </div>
        )}
        {showWinning &&
          winningsTotal.gt(MIN_CONSIDER_VALUE) && (
            <div className="redeemWinning">
              <div className="redeemWinning__icon-details-container">
                <div className="redeemWinning__icon icon icon--achievementBadge" />
                <div className="redeemWinning__details">
                  <div className="redeemWinning__heading">
                    <DecimalValue value={weiToEth(winningsTotal)} />{' '}
                    {collateralTokenToText(market.event.collateralToken)}
                  </div>
                  <div className="redeemWinning__label">Your Winnings</div>
                </div>
              </div>
              <div className="redeemWinning__action">
                <InteractionButton className="btn btn-primary" onClick={this.handleRedeemWinnings}>
                  Redeem Winnings
                </InteractionButton>
                <span className="redeemWinning__gasCost">Gas cost: {redeemWinningsTransactionGas} ETH</span>
              </div>
            </div>
          )}
      </div>
    )
  }

  renderControls() {
    return (
      <div className="marketControls container">
        <div className="row">
          {Object.keys(expandableViews)
            .filter(view =>
              typeof expandableViews[view].showCondition !== 'function' ||
                expandableViews[view].showCondition(this.props))
            .map(view => (
              <button
                key={view}
                type="button"
                className={cn({
                  marketControls__button: true,
                  'marketControls__button--active btn btn-primary': view === this.props.match.params.view,
                  [expandableViews[view].className]: view !== this.props.match.params.view,
                })}
                onClick={() => this.handleExpand(view)}
              >
                {expandableViews[view].label}
              </button>
            ))}
        </div>
      </div>
    )
  }

  renderMarketGraph() {
    const { market, marketGraph } = this.props
    if (!marketGraph.length) {
      return (
        <div className="container">
          <LoadingIndicator className="marketGraph__spinner" />
        </div>
      )
    }

    return <MarketGraph data={marketGraph} market={market} />
  }

  render() {
    const { market } = this.props

    const { marketFetchError } = this.state
    if (marketFetchError) {
      return (
        <div className="marketDetailPage">
          <div className="container">This market could not be found.</div>
        </div>
      )
    }

    if (!market.address) {
      return this.renderLoading()
    }

    return (
      <div className="marketDetailPage">
        <div className="container">
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-sm-7 col-sm-offset-0">
              <h1 className="marketTitle__heading">{market.eventDescription.title}</h1>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {this.renderDetails(market)}
            {this.renderInfos(market)}
          </div>
        </div>
        {this.renderControls(market)}
        <div
          ref={(div) => {
            this.divSharesNode = div
          }}
          className="expandable"
        >
          {this.renderExpandableContent()}
        </div>
        <div>{this.renderMarketGraph()}</div>
      </div>
    )
  }
}

MarketDetail.propTypes = {
  hasWallet: PropTypes.bool,
  params: PropTypes.shape({
    id: PropTypes.string,
    view: PropTypes.string,
  }),
  requestGasPrice: PropTypes.func,
  marketShares: PropTypes.objectOf(marketShareShape),
  marketTrades: PropTypes.arrayOf(marketTradeShape),
  marketGraph: PropTypes.arrayOf(PropTypes.object),
  defaultAccount: PropTypes.string,
  market: marketShape,
  changeUrl: PropTypes.func,
  fetchMarket: PropTypes.func,
  fetchMarketShares: PropTypes.func,
  fetchMarketTrades: PropTypes.func,
  fetchMarketTradesForAccount: PropTypes.func,
  redeemWinnings: PropTypes.func,
  requestGasCost: PropTypes.func,
  creatorIsModerator: PropTypes.bool,
  moderators: PropTypes.shape({
    address: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  gasCosts: gasCostsShape,
  gasPrice: PropTypes.instanceOf(Decimal),
}

export default MarketDetail

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import cn from 'classnames'
import Outcome from 'components/Outcome'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import InteractionButton from 'containers/InteractionButton'
import { add0xPrefix, weiToEth, getOutcomeName } from 'utils/helpers'
import { marketShareShape } from 'utils/shapes'
import {
  COLOR_SCHEME_DEFAULT,
  COLOR_SCHEME_SCALAR,
  OUTCOME_TYPES,
  LOWEST_DISPLAYED_VALUE,
  TRANSACTION_DESCRIPTIONS,
  RESOLUTION_TIME,
} from 'utils/constants'
import moment from 'moment'
import Decimal from 'decimal.js'
import { EXPAND_MY_SHARES } from 'components/MarketDetail/ExpandableViews'

import './dashboard.less'
import { isMarketResolved, isMarketClosed } from '../../utils/helpers'

const getNewMarkets = (markets = [], limit) =>
  markets.sort((a, b) => a.creationDate < b.creationDate).slice(0, limit || markets.length)

const getSoonClosingMarkets = (markets = [], limit) =>
  markets
    .filter(market => new Date() - new Date(market.eventDescription.resolutionDate) < 0)
    .sort((a, b) => a.eventDescription.resolutionDate > b.eventDescription.resolutionDate)
    .slice(0, limit || markets.length)

class Dashboard extends Component {
  componentWillMount() {
    if (!this.props.hasWallet) {
      this.props.changeUrl('/markets/list')
      return
    }

    if (this.props.gnosisInitialized) {
      this.props.requestMarkets()
      this.props.requestGasPrice()

      if (this.props.hasWallet) {
        this.props.requestAccountShares(this.props.defaultAccount)
        this.props.requestAccountTrades(this.props.defaultAccount)
        this.props.requestEtherTokens(this.props.defaultAccount)
      }
    }
  }

  @autobind
  handleViewMarket(market) {
    this.props.changeUrl(`/markets/${market.address}`)
    window.scrollTo(0, 0)
  }

  @autobind
  handleShowSellView(market, share) {
    this.props.changeUrl(`/markets/${market.address}/${EXPAND_MY_SHARES}/${add0xPrefix(share.id)}`)
  }

  @autobind
  handleCreateMarket() {
    this.props.changeUrl('/markets/new')
  }

  @autobind
  handleRedeemWinnigs(event, market) {
    event.stopPropagation()
    this.props.redeemWinnings(market)
  }

  renderControls() {
    return (
      <div className="dashboardControls">
        <div className="container">
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-sm-12 col-sm-offset-0">
              <InteractionButton
                onClick={this.handleCreateMarket}
                className="dashboardControls__button btn btn-default"
                whitelistRequired
              >
                Create Market
              </InteractionButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderNewMarkets(markets) {
    return markets.map((market) => {
      const viewMarket = () => this.handleViewMarket(market)
      const outcomeOptions = { showOnlyTrendingOutcome: true, showDate: true, dateFormat: 'D MMMM Y' }

      return (
        <div className="dashboardMarket dashboardMarket--new" key={market.address} onClick={viewMarket}>
          <div className="dashboardMarket__title">{market.eventDescription.title}</div>
          <Outcome market={market} opts={outcomeOptions} />
        </div>
      )
    })
  }

  renderClosingMarkets(markets) {
    return markets.map(market => (
      <div
        className="dashboardMarket dashboardMarket--closing dashboardMarket--twoColumns"
        key={market.address}
        onClick={() => this.handleViewMarket(market)}
      >
        <div className="dashboardMarket__leftCol">
          <div className="value">{moment.utc(market.eventDescription.resolutionDate).fromNow()}</div>
        </div>
        <div className="dashboardMarket__rightCol">
          <div className="dashboardMarket__title">{market.eventDescription.title}</div>
          <Outcome market={market} opts={{ showOnlyTrendingOutcome: true }} />
        </div>
      </div>
    ))
  }

  renderMyHoldings(holdings) {
    if (!Object.keys(holdings).length) {
      return <div>You aren&apos;t holding any share.</div>
    }

    return Object.keys(holdings).map((shareId) => {
      const share = holdings[shareId]
      const colorScheme = share.event.type === OUTCOME_TYPES.SCALAR ? COLOR_SCHEME_SCALAR : COLOR_SCHEME_DEFAULT
      const outcomeColorStyle = { backgroundColor: colorScheme[share.outcomeToken.index] }

      const viewMarketFunc = () => this.handleViewMarket(share.market)
      const redeemWinningsFunc = e => this.handleRedeemWinnigs(e, share.market)
      const showSellViewFunc = () => this.handleShowSellView(share.market, share)

      return (
        <div className="dashboardMarket dashboardMarket--onDark" key={share.id} onClick={viewMarketFunc}>
          <div className="dashboardMarket__title">{share.eventDescription.title}</div>
          <div className="outcome row">
            <div className="col-md-3">
              <div className="entry__color" style={outcomeColorStyle} />
              <div className="dashboardMarket--highlight">{getOutcomeName(share, share.outcomeToken.index)}</div>
            </div>
            <div className="col-md-2 dashboardMarket--highlight">
              {Decimal(share.balance)
                .div(1e18)
                .gte(LOWEST_DISPLAYED_VALUE) ? (
                  <DecimalValue value={weiToEth(share.balance)} />
                ) : (
                  `< ${LOWEST_DISPLAYED_VALUE}`
                )}
            </div>
            <div className="col-md-3 dashboardMarket--highlight">
              <DecimalValue value={weiToEth(share.isResolved ? share.winnings : share.value)} />&nbsp;
              <CurrencyName collateralToken={share.event.collateralToken} />
            </div>
            <div className="col-md-4 dashboardMarket--highlight">
              {share.isRedeemable && (
                <a href="javascript:void(0);" onClick={redeemWinningsFunc}>
                  REDEEM WINNINGS
                </a>
              )}
              {share.isSellable && (
                <a href="javascript:void(0);" onClick={showSellViewFunc}>
                  SELL
                </a>
              )}
            </div>
          </div>
        </div>
      )
    })
  }

  renderMyTrades(trades) {
    return trades.slice(0, 20).map((trade, index) => {
      const { market } = trade

      const colorScheme = market.event.type === OUTCOME_TYPES.SCALAR ? COLOR_SCHEME_SCALAR : COLOR_SCHEME_DEFAULT
      const outcomeColorStyle = { backgroundColor: colorScheme[trade.outcomeToken.index] }

      let averagePrice
      if (trade.orderType === 'BUY') {
        averagePrice = parseInt(trade.cost, 10) / parseInt(trade.outcomeTokenCount, 10)
      } else {
        averagePrice = parseInt(trade.profit, 10) / parseInt(trade.outcomeTokenCount, 10)
      }
      const viewMarket = () => this.handleViewMarket(market)

      return (
        <div
          className="dashboardMarket dashboardMarket--onDark"
          key={index}
          onClick={viewMarket}
        >
          <div className="dashboardMarket__title">{market.eventDescription.title}</div>
          <div className="outcome row">
            <div className="col-md-3">
              <div className="entry__color" style={outcomeColorStyle} />
              <div className="dashboardMarket--highlight">{getOutcomeName(market, trade.outcomeToken.index)}</div>
            </div>
            <div className="col-md-3 dashboardMarket--highlight">
              {new Decimal(averagePrice).toFixed(4)}{' '}
              {market.event && <CurrencyName collateralToken={market.event.collateralToken} />}
            </div>
            <div className="col-md-4 dashboardMarket--highlight">
              {moment.utc(trade.date).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
            </div>
            <div className="col-md-3 dashboardMarket--highlight">{TRANSACTION_DESCRIPTIONS[trade.orderType]}</div>
          </div>
        </div>
      )
    })
  }

  renderWidget(marketType) {
    const { markets, accountShares, accountTrades } = this.props

    const whitelistedMarkets = markets.filter(market =>
      Object.keys(market).length &&
        market.oracle &&
        market.event &&
        process.env.WHITELIST[market.creator] &&
        !isMarketResolved(market) &&
        !isMarketClosed(market))
    const newMarkets = getNewMarkets(whitelistedMarkets, 5)

    const closingMarkets = getSoonClosingMarkets(whitelistedMarkets, 5)

    if (marketType === 'newMarkets') {
      return (
        <div className="dashboardWidget col-md-6" key={marketType}>
          <div className="dashboardWidget__market-title">Latest Markets</div>
          <div
            className={cn({
              dashboardWidget__container: true,
              'no-markets': !newMarkets.length,
            })}
          >
            {newMarkets.length ? this.renderNewMarkets(newMarkets) : "There aren't new markets"}
          </div>
        </div>
      )
    }

    if (marketType === 'closingMarkets') {
      return (
        <div className="dashboardWidget col-md-6" key={marketType}>
          <div className="dashboardWidget__market-title">Closing Next</div>
          <div
            className={cn({
              dashboardWidget__container: true,
              'no-markets': !closingMarkets.length,
            })}
          >
            {closingMarkets.length ? this.renderClosingMarkets(closingMarkets) : "There aren't closing markets"}
          </div>
        </div>
      )
    }

    if (marketType === 'myHoldings') {
      return (
        <div className="dashboardWidget dashboardWidget--onDark col-md-6" key={marketType}>
          <div className="dashboardWidget__market-title">My Tokens</div>
          <div className="dashboardWidget__container">{this.renderMyHoldings(accountShares)}</div>
        </div>
      )
    }

    if (marketType === 'myTrades') {
      return (
        <div className="dashboardWidget dashboardWidget--onDark col-md-6" key={marketType}>
          <div className="dashboardWidget__market-title">My Trades</div>
          <div className="dashboardWidget__container">
            {accountTrades.length ? this.renderMyTrades(accountTrades) : "You haven't done any trade."}
          </div>
        </div>
      )
    }
  }

  render() {
    const { hasWallet, etherTokens, accountPredictiveAssets } = this.props

    let metricsSection = <div />
    let tradesHoldingsSection = <div className="dashboardWidgets dashboardWidgets--financial" />
    if (hasWallet) {
      metricsSection = (
        <div className="dashboardPage__stats">
          <div className="container">
            <div className="row dashboardStats">
              <div className="col-xs-10 col-xs-offset-1 col-sm-3 col-sm-offset-0 dashboardStats__stat">
                <div className="dashboardStats__icon icon icon--etherTokens" />
                <span className="dashboardStats__value">
                  <DecimalValue value={etherTokens} />
                </span>
                <div className="dashboardStats__label">Ether Tokens</div>
              </div>
              <div className="col-xs-10 col-xs-offset-1 col-sm-3 col-sm-offset-0 dashboardStats__stat">
                <div className="dashboardStats__icon icon icon--outstandingPredictions" />
                <span className="dashboardStats__value" style={{ color: 'green' }}>
                  <DecimalValue value={accountPredictiveAssets} />
                  &nbsp;ETH
                </span>
                <div className="dashboardStats__label">Outstanding predictions</div>
              </div>
            </div>
          </div>
        </div>
      )

      tradesHoldingsSection = (
        <div className="dashboardWidgets dashboardWidgets--financial">
          <div className="container">
            <div className="row">
              {this.renderWidget('myHoldings')}
              {this.renderWidget('myTrades')}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="dashboardPage">
        <div className="dashboardPage__header">
          <div className="pageFrame container">
            <div className="row">
              <div className="col-xs-10 col-xs-offset-1 col-sm-12 col-sm-offset-0">
                <div>
                  <h1>Dashboard</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        {metricsSection}
        {this.renderControls()}
        <div className="dashboardWidgets dashboardWidgets--markets">
          <div className="container">
            <div className="row">
              {this.renderWidget('newMarkets')}
              {this.renderWidget('closingMarkets')}
            </div>
          </div>
        </div>
        {tradesHoldingsSection}
      </div>
    )
  }
}

const marketPropType = PropTypes.object

Dashboard.propTypes = {
  markets: PropTypes.arrayOf(marketPropType),
  defaultAccount: PropTypes.string,
  hasWallet: PropTypes.bool,
  accountShares: PropTypes.objectOf(marketShareShape),
  accountTrades: PropTypes.array,
  accountPredictiveAssets: PropTypes.string,
  etherTokens: PropTypes.string,
  requestMarkets: PropTypes.func,
  requestGasPrice: PropTypes.func,
  requestAccountShares: PropTypes.func,
  requestAccountTrades: PropTypes.func,
  changeUrl: PropTypes.func,
  requestEtherTokens: PropTypes.func,
  gnosisInitialized: PropTypes.bool,
  redeemWinnings: PropTypes.func,
}

export default Dashboard

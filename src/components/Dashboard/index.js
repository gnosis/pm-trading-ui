import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import cn from 'classnames'
import PageFrame from 'components/layout/PageFrame'
import Block from 'components/layout/Block'
import Title from 'components/layout/Title'
import Outcome from 'components/Outcome'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import InteractionButton from 'containers/InteractionButton'
import { add0xPrefix, weiToEth, getOutcomeName } from 'utils/helpers'
import {
  COLOR_SCHEME_DEFAULT,
  LOWEST_DISPLAYED_VALUE,
  TRANSACTION_DESCRIPTIONS,
  RESOLUTION_TIME,
} from 'utils/constants'
import moment from 'moment'
import Decimal from 'decimal.js'
import { calcLMSRMarginalPrice, calcLMSROutcomeTokenCount } from 'api'
import { EXPAND_MY_SHARES } from 'components/MarketDetail/ExpandableViews'

import Metrics from './Metrics'
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
    return markets.map(market => (
      <div
        className="dashboardMarket dashboardMarket--new"
        key={market.address}
        onClick={() => this.handleViewMarket(market)}
      >
        <div className="dashboardMarket__title">{market.eventDescription.title}</div>
        <Outcome market={market} opts={{ showOnlyTrendingOutcome: true, showDate: true, dateFormat: 'MMMM Y' }} />
      </div>
    ))
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

  renderMyHoldings(holdings, markets, marketWinnings) {
    const myShares = holdings
      .map((holding, index) => {
        const eventAddress = add0xPrefix(holding.outcomeToken.event)

        const filteredMarkets = markets.filter(market =>
          process.env.WHITELIST[market.creator] &&
            market.event &&
            market.event.address === eventAddress &&
            Decimal(holding.balance).gt(LOWEST_DISPLAYED_VALUE))

        const market = filteredMarkets[0]
        if (market) {
          let probability = new Decimal(0)
          let maximumWin = new Decimal(0)
          const marketResolved = isMarketResolved(market)
          const outcomeTokenIndex = parseInt(holding.outcomeToken.index, 10)
          const winningsByOutcome = marketWinnings[market.address] ? marketWinnings[market.address] : {}

          const winnings = winningsByOutcome[outcomeTokenIndex]
            ? Decimal(winningsByOutcome[outcomeTokenIndex])
            : Decimal(0)

          const hasWinnings = marketResolved && winnings.gt(0)
          const hasBalance = Decimal(holding.balance)
            .div(1e18)
            .gt(LOWEST_DISPLAYED_VALUE)
          const canRedeemWinnings = marketResolved && hasWinnings

          // Check market is not empty
          if (market.event) {
            probability = calcLMSRMarginalPrice({
              netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
              funding: market.funding,
              outcomeTokenIndex: holding.outcomeToken.index,
            })
            maximumWin = calcLMSROutcomeTokenCount({
              netOutcomeTokensSold: market.netOutcomeTokensSold.slice(0),
              funding: market.funding,
              outcomeTokenIndex: holding.outcomeToken.index,
              cost: holding.balance,
            })
          }

          return (
            <div
              className="dashboardMarket dashboardMarket--onDark"
              key={holding.id}
              onClick={() => this.handleViewMarket(market)}
            >
              <div className="dashboardMarket__title">{holding.eventDescription.title}</div>
              <div className="outcome row">
                <div className="col-md-3">
                  <div
                    className="entry__color"
                    style={{ backgroundColor: COLOR_SCHEME_DEFAULT[holding.outcomeToken.index] }}
                  />
                  <div className="dashboardMarket--highlight">{getOutcomeName(market, holding.outcomeToken.index)}</div>
                </div>
                <div className="col-md-3 dashboardMarket--highlight">
                  {Decimal(holding.balance)
                    .div(1e18)
                    .gte(LOWEST_DISPLAYED_VALUE) ? (
                      <DecimalValue value={weiToEth(holding.balance)} />
                    ) : (
                      `< ${LOWEST_DISPLAYED_VALUE}`
                    )}&nbsp;
                  {market.event &&
                    market.event.type === 'SCALAR' && <CurrencyName outcomeToken={market.eventDescription.unit} />}
                </div>
                <div className="col-md-2 dashboardMarket--highlight">
                  <DecimalValue value={weiToEth(marketResolved ? winnings : maximumWin.mul(probability).toString())} />&nbsp;
                  {market.event ? <CurrencyName collateralToken={market.event.collateralToken} /> : <div />}
                </div>
                <div className="col-md-4 dashboardMarket--highlight">
                  {canRedeemWinnings &&
                    hasWinnings && (
                      <a href="javascript:void(0);" onClick={() => this.props.redeemWinnings(market)}>
                        REDEEM WINNINGS
                      </a>
                    )}
                  {!canRedeemWinnings &&
                    hasBalance && (
                      <a href="javascript:void(0);" onClick={() => this.handleShowSellView(market, holding)}>
                        SELL
                      </a>
                    )}
                </div>
              </div>
            </div>
          )
        }
      })
      .filter(val => !!val)

    return myShares.length ? myShares : <div>You aren&apos;t holding any share.</div>
  }

  renderMyTrades(trades, markets) {
    return trades.map((trade, index) => {
      const eventAddress = add0xPrefix(trade.outcomeToken.event)
      const filteredMarkets = markets.filter(market => market.event.address === eventAddress && process.env.WHITELIST[market.creator])
      const market = filteredMarkets.length ? filteredMarkets[0] : {}
      let averagePrice
      if (trade.orderType === 'BUY') {
        averagePrice = parseInt(trade.cost, 10) / parseInt(trade.outcomeTokenCount, 10)
      } else {
        averagePrice = parseInt(trade.profit, 10) / parseInt(trade.outcomeTokenCount, 10)
      }

      return (
        <div
          className="dashboardMarket dashboardMarket--onDark"
          key={index}
          onClick={() => this.handleViewMarket(market)}
        >
          <div className="dashboardMarket__title">{trade.eventDescription.title}</div>
          <div className="outcome row">
            <div className="col-md-3">
              <div
                className="entry__color"
                style={{ backgroundColor: COLOR_SCHEME_DEFAULT[trade.outcomeToken.index] }}
              />
              <div className="dashboardMarket--highlight">{getOutcomeName(market, trade.outcomeToken.index)}</div>
            </div>
            <div className="col-md-3 dashboardMarket--highlight">
              {new Decimal(averagePrice).toFixed(4)}{' '}
              {market.event && <CurrencyName collateralToken={market.event.collateralToken} />}
            </div>
            <div className="col-md-3 dashboardMarket--highlight">
              {moment.utc(trade.date).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
            </div>
            <div className="col-md-3 dashboardMarket--highlight">{TRANSACTION_DESCRIPTIONS[trade.orderType]}</div>
          </div>
        </div>
      )
    })
  }

  renderWidget(marketType) {
    const {
      markets, marketWinnings, accountShares, accountTrades,
    } = this.props

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
          <div className="dashboardWidget__market-title">Next Markets</div>
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
          <div className="dashboardWidget__container">
            {this.renderMyHoldings(accountShares, markets, marketWinnings)}
          </div>
        </div>
      )
    }

    if (marketType === 'myTrades') {
      return (
        <div className="dashboardWidget dashboardWidget--onDark col-md-6" key={marketType}>
          <div className="dashboardWidget__market-title">My Trades</div>
          <div className="dashboardWidget__container">
            {accountTrades.length ? this.renderMyTrades(accountTrades, markets) : "You haven't done any trade."}
          </div>
        </div>
      )
    }
  }

  render() {
    const { hasWallet } = this.props
    let metricsSection = <div />
    let tradesHoldingsSection = <div className="dashboardWidgets dashboardWidgets--financial" />
    if (hasWallet) {
      metricsSection = <Metrics />

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
          <PageFrame>
            <div className="row">
              <div className="col-xs-10 col-xs-offset-1 col-sm-12 col-sm-offset-0">
                <Block margin="md">
                  <Title>Dashboard</Title>
                </Block>
                <Block margin="xl">{metricsSection}</Block>
              </div>
            </div>
          </PageFrame>
        </div>
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
  //   selectedCategoricalOutcome: PropTypes.string,
  //   selectedBuyInvest: PropTypes.string,
  //   buyShares: PropTypes.func,
  //   market: marketPropType,
  markets: PropTypes.arrayOf(marketPropType),
  defaultAccount: PropTypes.string,
  hasWallet: PropTypes.bool,
  accountShares: PropTypes.array,
  accountTrades: PropTypes.array,
  accountPredictiveAssets: PropTypes.string,
  etherTokens: PropTypes.string,
  winnings: PropTypes.objectOf(PropTypes.string),
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

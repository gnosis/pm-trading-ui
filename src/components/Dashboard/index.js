import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import cn from 'classnames'
import OutcomeColorBox from 'components/OutcomeColorBox'
import PageFrame from 'components/layout/PageFrame'
import Block from 'components/layout/Block'
import Title from 'components/layout/Title'
import Outcome from 'components/Outcome'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { weiToEth, getOutcomeName, isMarketResolved, isMarketClosed, isModerator } from 'utils/helpers'
import { marketShareShape } from 'utils/shapes'
import {
  COLOR_SCHEME_DEFAULT,
  LOWEST_DISPLAYED_VALUE,
  TRANSACTION_DESCRIPTIONS,
  RESOLUTION_TIME,
  OUTCOME_TYPES,
  COLOR_SCHEME_SCALAR,
} from 'utils/constants'
import moment from 'moment'
import Decimal from 'decimal.js'
import { EXPAND_MY_SHARES } from 'routes/MarketDetails/components/ExpandableViews'
import { isFeatureEnabled, get } from 'utils/features'

import Metrics from './Metrics'
import './dashboard.scss'

const tournamentEnabled = isFeatureEnabled('tournament')

const getNewMarkets = (markets = [], limit) =>
  markets.sort((a, b) => a.creationDate < b.creationDate).slice(0, limit || markets.length)

const getSoonClosingMarkets = (markets = [], limit) =>
  markets
    .filter(market => new Date() - new Date(market.eventDescription.resolutionDate) < 0)
    .sort((a, b) => a.eventDescription.resolutionDate > b.eventDescription.resolutionDate)
    .slice(0, limit || markets.length)

class Dashboard extends Component {
  componentDidMount() {
    if (!this.props.collateralToken.symbol) {
      this.props.requestTokenSymbol()
    }

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

        if (this.props.collateralToken.address) {
          this.props.requestDefaultTokenAmount(this.props.collateralToken.address, this.props.defaultAccount)
        }
      }
    }

    if (tournamentEnabled) {
      this.props.fetchTournamentUsers()
      if (this.props.defaultAccount) {
        this.props.fetchTournamentUserData(this.props.defaultAccount)
      }
    }
  }

  @autobind
  handleViewMarket(market) {
    this.props.changeUrl(`/markets/${market.address}`)
    window.scrollTo(0, 0)
  }

  @autobind
  handleShowSellView(event, market, share) {
    event.stopPropagation()
    this.props.changeUrl(`/markets/${market.address}/${EXPAND_MY_SHARES}/${share.id}`)
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
    return <div />
  }

  renderNewMarkets(markets) {
    return markets.map((market) => {
      const viewMarket = () => this.handleViewMarket(market)
      const outcomeOptions = { showOnlyTrendingOutcome: true, showDate: true, dateFormat: 'D MMMM Y' }

      return (
        <div className="dashboardMarket dashboardMarket--new" key={market.address} onClick={viewMarket}>
          <div className="dashboardMarket__title">{market.eventDescription.title}</div>
          <Outcome
            resolved={isMarketResolved(market)}
            type={market.event.type}
            outcomeTokensSold={market.netOutcomeTokensSold}
            resolution={market.eventDescription.resolutionDate}
            funding={market.funding}
            outcomes={market.eventDescription.outcomes}
            winningOutcome={market.oracle.winningOutcome}
            upperBound={market.event.upperBound}
            lowerBound={market.event.lowerBound}
            decimals={market.eventDescription.decimals}
            unit={market.eventDescription.unit}
            opts={outcomeOptions}
          />
        </div>
      )
    })
  }

  renderClosingMarkets(markets) {
    return markets.map((market) => {
      const viewMarket = () => this.handleViewMarket(market)

      const timeTilClose = moment.duration(moment.utc(market.eventDescription.resolutionDate).diff(moment.utc()))
      let timeLeft = timeTilClose.humanize()

      if (timeTilClose.asMonths() > 1) {
        timeLeft = '> 30 d'
      }


      return (
        <div
          className="dashboardMarket dashboardMarket--closing dashboardMarket--twoColumns"
          key={market.address}
          onClick={viewMarket}
        >
          <div className="dashboardMarket__leftCol">
            <div className="value">{timeLeft}</div>
          </div>
          <div className="dashboardMarket__rightCol">
            <div className="dashboardMarket__title">{market.eventDescription.title}</div>
            <Outcome
              resolved={isMarketResolved(market)}
              type={market.event.type}
              outcomeTokensSold={market.netOutcomeTokensSold}
              resolution={market.eventDescription.resolutionDate}
              funding={market.funding}
              outcomes={market.eventDescription.outcomes}
              winningOutcome={market.oracle.winningOutcome}
              upperBound={market.event.upperBound}
              lowerBound={market.event.lowerBound}
              decimals={market.eventDescription.decimals}
              unit={market.eventDescription.unit}
              opts={{ showOnlyTrendingOutcome: true }}
            />
          </div>
        </div>
      )
    })
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
      const showSellViewFunc = e => this.handleShowSellView(e, share.market, share)

      return (
        <div className="dashboardMarket dashboardMarket--onDark" key={share.id} onClick={viewMarketFunc}>
          <div className="dashboardMarket__title">{share.eventDescription.title}</div>
          <div className="outcome row">
            <div className="col-md-3">
              <OutcomeColorBox style={outcomeColorStyle} />
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
              <CurrencyName tokenAddress={share.event.collateralToken} />
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
        <div className="dashboardMarket dashboardMarket--onDark" key={index} onClick={viewMarket}>
          <div className="dashboardMarket__title">{market.eventDescription.title}</div>
          <div className="outcome row">
            <div className="col-md-3">
              <OutcomeColorBox style={outcomeColorStyle} />
              <div className="dashboardMarket--highlight">{getOutcomeName(market, trade.outcomeToken.index)}</div>
            </div>
            <div className="col-md-3 dashboardMarket--highlight">
              {new Decimal(averagePrice).toFixed(4)}{' '}
              {market.event && <CurrencyName tokenAddress={market.event.collateralToken} />}
            </div>
            <div className="col-md-4 dashboardMarket--highlight">
              {moment.utc(trade.date).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
            </div>
            <div className="col-md-2 dashboardMarket--highlight">{TRANSACTION_DESCRIPTIONS[trade.orderType]}</div>
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
        isModerator(market.creator) &&
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
    const {
      hasWallet, collateralToken, accountPredictiveAssets,
    } = this.props

    let metricsSection = <div />
    let tradesHoldingsSection = <div className="dashboardWidgets dashboardWidgets--financial" />
    const predictedProfitFormatted = Decimal(accountPredictiveAssets).toDP(4, 1).toString()
    if (hasWallet) {
      metricsSection = <Metrics tokens={collateralToken.balance} tokenSymbol={collateralToken.symbol} tokenIcon={collateralToken.icon} predictedProfit={predictedProfitFormatted} />

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
  hasWallet: PropTypes.bool.isRequired,
  accountShares: PropTypes.objectOf(marketShareShape),
  accountTrades: PropTypes.array.isRequired,
  requestMarkets: PropTypes.func.isRequired,
  requestGasPrice: PropTypes.func.isRequired,
  requestAccountShares: PropTypes.func.isRequired,
  requestAccountTrades: PropTypes.func.isRequired,
  changeUrl: PropTypes.func.isRequired,
  requestDefaultTokenAmount: PropTypes.func.isRequired,
  gnosisInitialized: PropTypes.bool.isRequired,
  redeemWinnings: PropTypes.func.isRequired,
  accountPredictiveAssets: PropTypes.string.isRequired,
  requestTokenSymbol: PropTypes.func.isRequired,
  fetchTournamentUsers: PropTypes.func.isRequired,
  fetchTournamentUserData: PropTypes.func.isRequired,
  collateralToken: PropTypes.shape({
    symbol: PropTypes.string,
    balance: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
}

Dashboard.defaultProps = {
  markets: [],
  defaultAccount: undefined,
  accountShares: {},
}

export default Dashboard

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'moment-duration-format'
import autobind from 'autobind-decorator'
import ImmutablePropTypes from 'react-immutable-proptypes'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import { GAS_COST } from 'utils/constants'
import { Map, List } from 'immutable'
import {
  marketShape, marketShareShape, marketTradeShape, ReactRouterMatchShape,
} from 'utils/shapes'
import { isMarketResolved } from 'store/utils/marketStatus'
import MarketGraph from 'routes/MarketDetails/components/MarketGraph'
import expandableViews, { EXPAND_MY_SHARES } from 'routes/MarketDetails/components/ExpandableViews'
import Controls from './Controls'
import Details from './Details'
import Infos from './Infos'
import style from './marketDetail.mod.scss'

const cx = cn.bind(style)

const MARKET_FETCH_INTERVAL = 15000

class MarketDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      marketFetchError: undefined,
    }

    this.firstFetch = true
    this.autoRefreshStop = false
  }

  componentDidMount() {
    this.scrollToSharesDiv()
    this.autoRefreshStop = false
    this.refresh()
  }

  componentWillUnmount() {
    this.autoRefreshStop = true
    clearTimeout(this.fetchDataTimer)
  }

  @autobind
  getAvailableView() {
    this.firstFetch = false
    return Object.keys(expandableViews).find(view => expandableViews[view].showCondition(this.props))
  }

  scrollToSharesDiv = () => {
    const {
      match: {
        params: { view = [] },
      },
    } = this.props
    const isMySharesView = view.indexOf(EXPAND_MY_SHARES) !== -1
    const shouldScroll = this.divSharesNode && isMySharesView
    if (shouldScroll) {
      const y = this.divSharesNode.offsetTop
      window.scrollTo(0, y)
    } else {
      window.scrollTo(0, 0)
    }
  }

  @autobind
  async refresh() {
    try {
      await this.fetchEssentialData()
    } catch (e) {
      console.warn(`market detail update: fetch failed ${e}`)
    } finally {
      if (!this.autoRefreshStop) {
        this.fetchDataTimer = setTimeout(this.refresh, MARKET_FETCH_INTERVAL)
      }
    }
  }

  async fetchMarketUpdates() {
    const {
      fetchMarket,
      fetchMarketTrades,
      market,
      changeUrl,
      requestGasCost,
      requestTokenSymbol,
      match: {
        params: { view, id },
      },
      collateralTokenSymbol,
    } = this.props
    return fetchMarket()
      .then(() => {
        fetchMarketTrades(market)
        if (this.firstFetch && !view) {
          const availableView = this.getAvailableView()
          if (availableView) {
            changeUrl(`/markets/${id}/${availableView}`)
          }
        }

        if (isMarketResolved(market)) {
          requestGasCost(GAS_COST.REDEEM_WINNINGS, { eventAddress: market.eventAddress })
        }

        if (!collateralTokenSymbol && market.collateralToken) {
          requestTokenSymbol(market.collateralToken)
        }
      })
      .catch((err) => {
        this.setState({
          marketFetchError: err,
        })
      })
  }

  async fetchGasCosts() {
    const { hasWallet, requestGasCost } = this.props
    if (hasWallet) {
      return Promise.all([requestGasCost(GAS_COST.BUY_SHARES), requestGasCost(GAS_COST.SELL_SHARES)])
    }

    return Promise.resolve()
  }

  async fetchMarketShares() {
    const {
      defaultAccount,
      fetchMarketTradesForAccount,
      fetchMarketShares,
      match: {
        params: { id },
      },
    } = this.props
    if (defaultAccount && id !== undefined) {
      return Promise.all([fetchMarketTradesForAccount(defaultAccount), fetchMarketShares(defaultAccount)])
    }

    return Promise.resolve()
  }

  // Check available views on first fetch
  @autobind
  async fetchEssentialData() {
    const { requestGasPrice } = this.props
    await Promise.all([this.fetchMarketUpdates(), this.fetchGasCosts(), this.fetchMarketShares(), requestGasPrice()])
  }

  @autobind
  handleExpand(view) {
    const {
      match: {
        params: { view: currentView, id },
      },
      changeUrl,
    } = this.props
    if (currentView !== view) {
      changeUrl(`/markets/${id}/${view}`)
    } else {
      changeUrl(`/markets/${id}/`)
    }
  }

  @autobind
  handleRedeemWinnings() {
    const { market, redeemWinnings } = this.props
    return redeemWinnings(market)
  }

  renderLoading() {
    return (
      <div className={cx('container')}>
        <div>
Loading...
        </div>
      </div>
    )
  }

  renderExpandableContent() {
    const {
      match: {
        params: { view: currentView = false },
      },
    } = this.props

    if (currentView && expandableViews[currentView] && expandableViews[currentView].component) {
      const view = expandableViews[currentView]

      if (typeof view.showCondition !== 'function' || view.showCondition(this.props)) {
        const ViewComponent = view.component
        return (
          <div className={cx('inner')}>
            <div className={cx('container')}>
              <ViewComponent {...this.props} />
            </div>
          </div>
        )
      }
    }

    return <div />
  }

  render() {
    const {
      market,
      marketGraph,
      marketShares,
      gasCosts,
      gasPrice,
      defaultAccount,
      moderators,
      collateralTokenSymbol,
    } = this.props

    const { marketFetchError } = this.state
    if (marketFetchError) {
      return (
        <div className={cx('container')}>
          <div>
            This market could not be found.
          </div>
        </div>
      )
    }

    if (!market.address) {
      return this.renderLoading()
    }

    return (
      <div>
        <div className={cx('container')}>
          <div className={cx('row')}>
            <div className={cx('col-xs-10 col-xs-offset-1 col-sm-7 col-sm-offset-0')}>
              <h1 className={cx('marketTitleHeading')}>
                {market.title}
              </h1>
            </div>
          </div>
        </div>
        <div className={cx('container')}>
          <div className={cx('row')}>
            <Details
              market={market}
              marketShares={marketShares}
              gasCosts={gasCosts}
              gasPrice={gasPrice}
              handleRedeemWinnings={this.handleRedeemWinnings}
            />
            <Infos
              market={market}
              defaultAccount={defaultAccount}
              moderators={moderators}
              collateralTokenSymbol={collateralTokenSymbol}
            />
          </div>
        </div>
        <Controls handleExpand={this.handleExpand} {...this.props} />
        <div
          ref={(div) => {
            this.divSharesNode = div
          }}
          className={cx('expandable')}
        >
          {this.renderExpandableContent()}
        </div>
        {/* <MarketGraph data={marketGraph} market={market} /> */}
      </div>
    )
  }
}

MarketDetail.propTypes = {
  hasWallet: PropTypes.bool,
  marketShares: ImmutablePropTypes.list,
  marketTrades: PropTypes.arrayOf(marketTradeShape),
  marketGraph: PropTypes.arrayOf(PropTypes.object),
  defaultAccount: PropTypes.string,
  market: marketShape.isRequired,
  requestGasPrice: PropTypes.func.isRequired,
  changeUrl: PropTypes.func.isRequired,
  fetchMarket: PropTypes.func.isRequired,
  fetchMarketShares: PropTypes.func.isRequired,
  fetchMarketTrades: PropTypes.func.isRequired,
  fetchMarketTradesForAccount: PropTypes.func.isRequired,
  redeemWinnings: PropTypes.func.isRequired,
  requestGasCost: PropTypes.func.isRequired,
  isModerator: PropTypes.bool,
  moderators: PropTypes.shape({
    address: PropTypes.string,
  }),
  gasCosts: ImmutablePropTypes.map,
  gasPrice: PropTypes.instanceOf(Decimal),
  match: ReactRouterMatchShape.isRequired,
  collateralTokenSymbol: PropTypes.string,
  requestTokenSymbol: PropTypes.func.isRequired,
}

MarketDetail.defaultProps = {
  isModerator: false,
  hasWallet: false,
  moderators: {},
  marketShares: List(),
  marketTrades: [],
  marketGraph: [],
  defaultAccount: '',
  gasCosts: Map({}),
  gasPrice: Decimal(0),
  collateralTokenSymbol: '',
}

export default MarketDetail

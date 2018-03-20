import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'moment-duration-format'
import autobind from 'autobind-decorator'
import ImmutablePropTypes from 'react-immutable-proptypes'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import { GAS_COST } from 'utils/constants'
import { Map } from 'immutable'
import { marketShape, marketShareShape, marketTradeShape, ReactRouterMatchShape } from 'utils/shapes'
import { isMarketResolved } from 'utils/helpers'
import MarketGraph from 'routes/MarketDetails/components/MarketGraph'
import expandableViews, { EXPAND_MY_SHARES } from 'routes/MarketDetails/components/ExpandableViews'
import config from 'config.json'
import Controls from './Controls'
import Details from './Details'
import Infos from './Infos'
import style from './marketDetail.mod.scss'

const cx = cn.bind(style)

class MarketDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      marketFetchError: undefined,
    }
  }

  componentDidMount() {
    this.fetchEssentialData()
    this.fetchDataTimer = setInterval(this.fetchEssentialData, config.fetchMarketTimeInterval)
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
    const { view = '' } = this.props.match.params
    const isMySharesView = view.indexOf(EXPAND_MY_SHARES) !== -1
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
  fetchEssentialData() {
    this.props
      .fetchMarket()
      .then(() => {
        this.props.fetchMarketTrades(this.props.market)
        const availableView = this.getAvailableView()
        if (availableView) {
          this.props.changeUrl(`/markets/${this.props.match.params.id}/${availableView}`)
        }

        if (isMarketResolved(this.props.market)) {
          this.props.requestGasCost(GAS_COST.REDEEM_WINNINGS, { eventAddress: this.props.market.event.address })
        }

        if (!this.props.collateralTokenSymbol) {
          this.props.requestTokenSymbol()
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
        <div>
          <div className={cx('container')}>This market could not be found.</div>
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
              <h1 className={cx('marketTitleHeading')}>{market.eventDescription.title}</h1>
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
        <MarketGraph data={marketGraph} market={market} />
      </div>
    )
  }
}

MarketDetail.propTypes = {
  hasWallet: PropTypes.bool,
  marketShares: PropTypes.objectOf(marketShareShape),
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
  collateralTokenSymbol: PropTypes.string.isRequired,
  requestTokenSymbol: PropTypes.func.isRequired,
}

MarketDetail.defaultProps = {
  isModerator: false,
  hasWallet: false,
  moderators: {},
  marketShares: {},
  marketTrades: [],
  marketGraph: [],
  defaultAccount: '',
  gasCosts: Map({}),
  gasPrice: Decimal(0),
}

export default MarketDetail

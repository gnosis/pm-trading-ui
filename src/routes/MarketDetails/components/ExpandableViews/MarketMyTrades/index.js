import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import moment from 'moment'
import CurrencyName from 'components/CurrencyName'
import { RESOLUTION_TIME, COLOR_SCHEME_SCALAR, COLOR_SCHEME_DEFAULT, OUTCOME_TYPES } from 'utils/constants'
import { getOutcomeName, weiToEth } from 'utils/helpers'
import { marketShape, marketTradeShape } from 'utils/shapes'
import TableHeader from './TableHeader'
import TradeRow from './TradeRow'

import './marketMyTrades.scss'

class MarketMyTrades extends Component {
  static propTypes = {
    market: marketShape,
    marketTrades: PropTypes.arrayOf(marketTradeShape),
    defaultAccount: PropTypes.string,
    fetchMarketTradesForAccount: PropTypes.func,
  }

  static defaultProps = {
    market: {
      event: {},
      eventDescription: {},
    },
    marketTrades: [],
    defaultAccount: '',
    fetchMarketTradesForAccount: () => {},
  }

  componentDidMount() {
    const { market, marketTrades, defaultAccount } = this.props
    if (!marketTrades || marketTrades.length === 0) {
      this.props.fetchMarketTradesForAccount(market.address, defaultAccount)
    }
  }

  renderTrades() {
    const { market, marketTrades, market: { event: { type } } } = this.props
    const colorScheme = type === OUTCOME_TYPES.SCALAR ? COLOR_SCHEME_SCALAR : COLOR_SCHEME_DEFAULT

    const tableRowElements = marketTrades.map((trade) => {
      const outcomeColorStyle = { backgroundColor: colorScheme[trade.outcomeToken.index] }
      const tradeDate = moment
        .utc(trade.date)
        .local()
        .format(RESOLUTION_TIME.ABSOLUTE_FORMAT)
      const outcomeName = getOutcomeName(market, trade.outcomeToken.index)

      let tradeCost = '0'
      if (trade.cost !== 'None') {
        tradeCost = (
          <Fragment>
            {Decimal(weiToEth(trade.cost))
              .toDP(2, 1)
              .toString()}&nbsp;
            <CurrencyName collateralToken={market.event.collateralToken} />
          </Fragment>
        )
      }

      return (
        <TradeRow
          key={trade.id}
          trade={trade}
          tradeCost={tradeCost}
          outcomeColorStyle={outcomeColorStyle}
          tradeDate={tradeDate}
          outcomeName={outcomeName}
          collateralToken={market.event.collateralToken}
        />
      )
    })

    return tableRowElements
  }

  render() {
    const { marketTrades } = this.props
    if (marketTrades && marketTrades.length > 0) {
      return (
        <div className="marketMyTrades">
          <h2 className="marketMyTrades__heading">My Trades</h2>
          <TableHeader />
          <table className="table marketMyTrades__shareTable">
            <tbody>{this.renderTrades()}</tbody>
          </table>
        </div>
      )
    }

    return (
      <div className="marketMyTrades">
        <h2 className="marketMyTrades__heading">You haven&apos;t interacted with this market yet.</h2>
        <h2>
          <small>Every transaction that happens on this market will be shown here.</small>
        </h2>
      </div>
    )
  }
}

export default MarketMyTrades

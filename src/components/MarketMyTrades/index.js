import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import moment from 'moment'
import { decimalToText } from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { RESOLUTION_TIME } from 'utils/constants'
import { getOutcomeName, weiToEth } from 'utils/helpers'
import { marketShape, marketTradeShape } from 'utils/shapes'

import './marketMyTrades.less'
import { COLOR_SCHEME_SCALAR, COLOR_SCHEME_DEFAULT, OUTCOME_TYPES } from '../../utils/constants'

class MarketMyTrades extends Component {
  static propTypes = {
    market: marketShape,
    marketTrades: PropTypes.arrayOf(marketTradeShape),
    defaultAccount: PropTypes.string,
    fetchMarketTradesForAccount: PropTypes.func,
  }

  componentWillMount() {
    const { market, defaultAccount } = this.props
    if (!market.participantTrades || market.participantTrades.length === 0) {
      // Retrieve participant trades to state
      this.props.fetchMarketTradesForAccount(market.address, defaultAccount)
    }
  }

  getAverageCost(order) {
    if (order.orderType === 'BUY') {
      return new Decimal(order.cost).div(order.outcomeTokenCount).toString()
    } else if (order.orderType === 'SELL') {
      return new Decimal(order.profit).div(order.outcomeTokenCount).toString()
    } else if (order.orderType === 'SHORT SELL') {
      return new Decimal(order.cost).div(order.outcomeTokenCount).toString()
    }
    return undefined
  }

  renderTrades() {
    const { market, marketTrades, market: { event: { type } } } = this.props
    const colorScheme = type === OUTCOME_TYPES.SCALAR ? COLOR_SCHEME_SCALAR : COLOR_SCHEME_DEFAULT

    const tableRowElements = marketTrades.map((trade) => {
      const outcomeColorStyle = { backgroundColor: colorScheme[trade.outcomeToken.index] }

      return (
        <tr className="marketMyTrades__share" key={trade.id}>
          <td>
            <div className="shareOutcome__color" style={outcomeColorStyle} />
          </td>
          <td>{trade.orderType}</td>
          <td>{getOutcomeName(market, trade.outcomeToken.index)}</td>
          <td>{decimalToText(new Decimal(trade.outcomeTokenCount).div(1e18), 4)}</td>
          <td>
            {decimalToText(this.getAverageCost(trade))}
            <CurrencyName collateralToken={market.event.collateralToken} />
          </td>
          <td>
            {moment
              .utc(trade.date)
              .local()
              .format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
          </td>
          <td>
            {trade.cost !== 'None' ? (
              <div>
                {Decimal(weiToEth(trade.cost))
                  .toDP(2, 1)
                  .toString()}&nbsp;
                <CurrencyName collateralToken={market.event.collateralToken} />
              </div>
            ) : (
              '0'
            )}
          </td>
        </tr>
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
          <table className="table marketMyTrades__shareTable">
            <thead>
              <tr>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--index" />
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Order Type</th>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Outcome</th>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">
                  Outcome token count
                </th>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Avg. Price</th>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Date</th>
                <th className="marketMyTrades__tableHeading marketMyTrades__tableHeading--group">Cost</th>
              </tr>
            </thead>
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

import React from 'react'
import PropTypes from 'prop-types'
import { getOutcomeName } from 'utils/helpers'
import CurrencyName from 'components/CurrencyName'
import { decimalToText } from 'components/DecimalValue'
import Decimal from 'decimal.js'

const getAverageCost = (order) => {
  if (order.orderType === 'BUY') {
    return new Decimal(order.cost).div(order.outcomeTokenCount).toString()
  } else if (order.orderType === 'SELL') {
    return new Decimal(order.profit).div(order.outcomeTokenCount).toString()
  }

  return undefined
}

const TradeRow = ({
  trade, outcomeColorStyle, collateralToken, tradeDate, outcomeName, tradeCost,
}) => (
  <tr className="marketMyTrades__share">
    <td>
      <div className="shareOutcome__color" style={outcomeColorStyle} />
    </td>
    <td>{trade.orderType}</td>
    <td>{outcomeName}</td>
    <td>{decimalToText(new Decimal(trade.outcomeTokenCount).div(1e18), 4)}</td>
    <td>
      {decimalToText(getAverageCost(trade))}
      <CurrencyName collateralToken={collateralToken} />
    </td>
    <td>{tradeDate}</td>
    <td>{tradeCost}</td>
  </tr>
)

export default TradeRow

import React from 'react'
import PropTypes from 'prop-types'
import CurrencyName from 'components/CurrencyName'
import { decimalToText } from 'components/DecimalValue'
import { marketTradeShape } from 'utils/shapes'
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

TradeRow.propTypes = {
  trade: marketTradeShape,
  outcomeColorStyle: PropTypes.shape({
    backgroundColor: PropTypes.string,
  }),
  collateralToken: PropTypes.string,
  tradeDate: PropTypes.string,
  outcomeName: PropTypes.string,
  tradeCost: PropTypes.string,
}

TradeRow.defaultProps = {
  trade: {},
  outcomeColorStyle: {},
  collateralToken: '',
  tradeDate: '',
  outcomeName: '',
  tradeCost: '',
}

export default TradeRow

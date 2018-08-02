import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import CurrencyName from 'components/CurrencyName'
import { decimalToText } from 'components/DecimalValue'
import { marketTradeShape } from 'utils/shapes'
import Decimal from 'decimal.js'
import style from '../marketMyTrades.scss'

const cx = cn.bind(style)

const getAverageCost = order => new Decimal(order.price).div(order.outcomeToken.outcomeTokenCount).toString()

const TradeRow = ({
  trade, outcomeColorStyle, collateralToken, tradeDate, outcomeName, tradeCost,
}) => (
  <tr className={cx('shareTableRow')}>
    <td>
      <div className={cx('shareOutcomeColor')} style={outcomeColorStyle} />
    </td>
    <td>{trade.orderType}</td>
    <td>{outcomeName}</td>
    <td>{decimalToText(new Decimal(trade.outcomeToken.outcomeTokenCount).div(1e18), 4)}</td>
    <td>
      {decimalToText(getAverageCost(trade))}&nbsp;
      <CurrencyName tokenAddress={collateralToken} />
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
  tradeCost: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
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

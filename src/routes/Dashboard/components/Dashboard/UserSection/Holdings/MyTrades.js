import React from 'react'
import moment from 'moment'
import Decimal from 'decimal.js'
import className from 'classnames/bind'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { Link } from 'react-router-dom'
import { RESOLUTION_TIME } from 'utils/constants'
import { ORDER_TYPE_BUY, ORDER_TYPE_SELL } from 'store/models/trade'

import style from './MyTrades.mod.scss'

const cx = className.bind(style)

const WORDING_ORDER_TYPE = {
  [ORDER_TYPE_SELL]: 'Sold',
  [ORDER_TYPE_BUY]: 'Bought',
}

const Trade = ({ trade }) => (
  <div className={cx('trade')}>
    <Link className={cx('title')} to={`/markets/${trade.market.address}`}>
      {trade.marketTitle}
    </Link>
    <div className={cx('outcome', 'row')}>
      <div className={cx('tradeOutcome', 'col-md-3')}>
        <OutcomeColorBox scheme={trade.marketType} outcomeIndex={trade.outcomeToken.index} />&nbsp;
      </div>
      <div className={cx('tradeAmount', 'col-md-3')}>
        <DecimalValue value={Decimal(trade.price).div(trade.outcomeToken.outcomeTokensSold)} />&nbsp;
        {trade.collateralTokenAddress ? <CurrencyName tokenAddress={trade.collateralTokenAddress} /> : <span>ETH</span> }
      </div>
      <div className={cx('tradePrice', 'col-md-4')}>{moment.utc(trade.date).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}</div>
      <div className={cx('orderType', 'col-md-2')}>{WORDING_ORDER_TYPE[trade.orderType]}</div>
    </div>
  </div>
)

const MyTrades = ({ trades }) => (
  <div>
    {trades.map(trade => <Trade key={trade.id} trade={trade} />)}
  </div>
)

export default MyTrades

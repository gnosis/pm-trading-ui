import React from 'react'
import ImmutableProptypes from 'react-immutable-proptypes'
import moment from 'moment'
import Decimal from 'decimal.js'
import className from 'classnames/bind'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { Link } from 'react-router-dom'
import { RESOLUTION_TIME } from 'utils/constants'
import TradeRecord, { ORDER_TYPE_BUY, ORDER_TYPE_SELL } from 'store/models/trade'

import style from './style.mod.scss'

const cx = className.bind(style)

const WORDING_ORDER_TYPE = {
  [ORDER_TYPE_SELL]: 'Sold',
  [ORDER_TYPE_BUY]: 'Bought',
}

const Trade = ({ trade }) => (
  <div className={cx('trade')}>
    <div className={cx('row')}>
      <Link className={cx('title', 'col-md-12')} to={`/markets/${trade.market.address}`} title={trade.marketTitle}>
        {trade.marketTitle}
      </Link>
    </div>
    <div className={cx('outcome', 'row')}>
      <div className={cx('tradeOutcome', 'col-md-3')}>
        <OutcomeColorBox scheme={trade.marketType} outcomeIndex={trade.outcomeToken.index} />&nbsp;
        {trade.outcomeToken.name}
      </div>
      <div className={cx('tradeAmount', 'col-md-4')}>
        <DecimalValue value={Decimal(trade.price).div(trade.outcomeToken.outcomeTokensSold)} />&nbsp;
        {trade.collateralTokenAddress ? <CurrencyName tokenAddress={trade.collateralTokenAddress} /> : <span>ETH</span> }
      </div>
      <div className={cx('tradePrice', 'col-md-5')}>
        <span title={moment.utc(trade.date).format(RESOLUTION_TIME.RELATIVE_LONG_FORMAT)}>
          {moment.utc(trade.date).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
        </span>
      </div>
      <div className={cx('orderType', 'col-md-1')}>{WORDING_ORDER_TYPE[trade.orderType]}</div>
    </div>
  </div>
)

Trade.propTypes = {
  trade: ImmutableProptypes.recordOf(TradeRecord).isRequired,
}

const MyTrades = ({ trades }) => (
  <div className={cx('trades', 'category')}>
    <h2 className={cx('title')}>My Trades</h2>
    {trades.size > 0 ? (
      trades.map(trade => <Trade key={trade.id} trade={trade} />)
    ) : (
      <div className={cx('no-trades')}>
        You haven&apos;t done any trades yet.
      </div>
    )}
  </div>
)

MyTrades.propTypes = {
  trades: ImmutableProptypes.listOf(ImmutableProptypes.recordOf(TradeRecord)).isRequired,
}

export default MyTrades

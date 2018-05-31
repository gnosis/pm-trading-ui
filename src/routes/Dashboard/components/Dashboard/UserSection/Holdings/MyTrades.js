import React from 'react'
import className from 'classnames/bind'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import DecimalValue from 'components/DecimalValue'
import { weiToEth } from 'utils/helpers'
import { ORDER_TYPE_BUY, ORDER_TYPE_SELL } from 'store/models/trade'

import style from './MyTrades.mod.scss'

const cx = className.bind(style)

const WORDING_ORDER_TYPE = {
  [ORDER_TYPE_SELL]: 'Sold',
  [ORDER_TYPE_BUY]: 'Bought',
}

const Trade = ({ trade }) => (
  <div className={cx('trade')}>
    <div className={cx('title')}>{trade.marketTitle}</div>
    <div className={cx('outcome')}>
      <OutcomeColorBox />
      <div className={cx('tradeAmount')}><DecimalValue value={weiToEth(trade.outcomeToken.outcomeTokensSold)} /></div>
      <div className={cx('tradePrice')}><DecimalValue value={weiToEth(trade.price)} /></div>
    </div>
    <div className={cx('orderType')}>{WORDING_ORDER_TYPE[trade.orderType]}</div>
  </div>
)

const MyTrades = ({ trades }) => (
  <div>
    {trades.map(trade => <Trade key={trade.id} trade={trade} />)}
  </div>
)

export default MyTrades

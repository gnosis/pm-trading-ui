import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import className from 'classnames/bind'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { Link } from 'react-router-dom'
import { RESOLUTION_TIME } from 'utils/constants'
import { marketRecordShape } from 'utils/shapes'
import { ORDER_TYPE_BUY, ORDER_TYPE_SELL } from 'store/models/trade'
import { OutcomeRecord } from 'store/models/market'

import style from './style.mod.scss'

const cx = className.bind(style)

const WORDING_ORDER_TYPE = {
  [ORDER_TYPE_SELL]: 'Sold',
  [ORDER_TYPE_BUY]: 'Bought',
}

const Trade = ({
  market, marketTitle, marketType, outcomeToken, collateralTokenAddress, date, orderType, price,
}) => (
  <div className={cx('trade')}>
    <div className={cx('row')}>
      <Link className={cx('title', 'col-md-12')} to={`/markets/${market.address}`} title={marketTitle}>
        {marketTitle}
      </Link>
    </div>
    <div className={cx('outcome', 'row')}>
      <div className={cx('tradeOutcome', 'col-md-3')}>
        <OutcomeColorBox scheme={marketType} outcomeIndex={outcomeToken.index} />&nbsp;
        {outcomeToken.name}
      </div>
      <div className={cx('tradeAmount', 'col-md-4')}>
        <DecimalValue value={Decimal(price).div(outcomeToken.outcomeTokenCount)} />&nbsp;
        {collateralTokenAddress ? <CurrencyName tokenAddress={collateralTokenAddress} /> : <span>ETH</span> }
      </div>
      <div className={cx('tradePrice', 'col-md-5')}>
        <span title={moment.utc(date).format(RESOLUTION_TIME.RELATIVE_LONG_FORMAT)}>
          {moment.utc(date).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
        </span>
      </div>
      <div className={cx('orderType', 'col-md-1')}>{WORDING_ORDER_TYPE[orderType]}</div>
    </div>
  </div>
)

Trade.propTypes = {
  marketTitle: PropTypes.string.isRequired,
  marketType: PropTypes.string.isRequired,
  market: PropTypes.object.isRequired,
  date: PropTypes.instanceOf(moment).isRequired,
  orderType: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  outcomeToken: PropTypes.shape(OutcomeRecord).isRequired,
  collateralTokenAddress: PropTypes.string.isRequired,
}

export default Trade

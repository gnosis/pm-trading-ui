import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import Decimal from 'decimal.js'
import className from 'classnames/bind'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { Link } from 'react-router-dom'
import { RESOLUTION_TIME } from 'utils/constants'
import { ORDER_TYPE_BUY, ORDER_TYPE_SELL } from 'store/models/trade'
import { OutcomeRecord } from 'store/models/market'

import style from './style.scss'

const cx = className.bind(style)

const Trade = ({
  market, marketTitle, marketType, outcomeToken, collateralTokenAddress, date, orderType, price, t,
}) => {
  const WORDING_ORDER_TYPE = {
    [ORDER_TYPE_SELL]: t('dashboard.sold'),
    [ORDER_TYPE_BUY]: t('dashboard.bought'),
  }
  return (
    <div className={cx('trade')}>
      <div className={cx('row')}>
        <Link className={cx('title', 'col-md-12')} to={`/markets/${market.address}`} title={marketTitle}>
          {marketTitle}
        </Link>
      </div>
      <div className={cx('outcome')}>
        <div className={cx('tradeOutcome')}>
          <OutcomeColorBox scheme={marketType} outcomeIndex={outcomeToken.index} />
          &nbsp;
          {outcomeToken.name}
        </div>
        <div className={cx('tradeAmount')}>
          <DecimalValue value={Decimal(price).div(outcomeToken.outcomeTokenCount)} />
          &nbsp;
          {collateralTokenAddress ? <CurrencyName tokenAddress={collateralTokenAddress} /> : <span>ETH</span>}
        </div>
        <div className={cx('tradeDate')}>
          <span title={moment.utc(date).format(RESOLUTION_TIME.RELATIVE_LONG_FORMAT)}>
            {moment.utc(date).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
          </span>
        </div>
        <div className={cx('orderType')}>{WORDING_ORDER_TYPE[orderType]}</div>
      </div>
    </div>
  )
}
Trade.propTypes = {
  marketTitle: PropTypes.string.isRequired,
  marketType: PropTypes.string.isRequired,
  market: PropTypes.object.isRequired,
  date: PropTypes.instanceOf(moment).isRequired,
  orderType: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  outcomeToken: PropTypes.shape(OutcomeRecord).isRequired,
  collateralTokenAddress: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(Trade)

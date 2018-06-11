import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import classnames from 'classnames/bind'

import outstandingPredictionsIcon from 'routes/Dashboard/assets/icon_outstandingPredictions.svg'
import etherTokensIcon from 'routes/Dashboard/assets/icon_etherTokens.svg'

import CurrencyName from 'components/CurrencyName'
import DecimalValue from 'components/DecimalValue'
import { weiToEth } from 'utils/helpers'

import Metric from './Metric'
import style from './Metrics.mod.scss'

const cx = classnames.bind(style)

const Metrics = ({ collateralToken = {}, predictedProfits }) => (
  <div className={cx('metrics')}>
    <div className={cx('container')}>
      <Metric isLoading={collateralToken.symbol === '/'} src={etherTokensIcon} explanation={`${collateralToken.symbol} tokens`}>
        <DecimalValue value={collateralToken.balance} className={cx('metric-value')} />&nbsp;
        <CurrencyName tokenAddress={collateralToken.address} />
      </Metric>
      <Metric isLoading={typeof predictedProfits === 'undefined'} src={outstandingPredictionsIcon} explanation="Predicted Profits">
        <DecimalValue value={weiToEth(predictedProfits)} className={cx('metric-value')} />&nbsp;
        <CurrencyName tokenAddress={collateralToken.address} />
      </Metric>
    </div>
  </div>
)

Metrics.propTypes = {
  collateralToken: PropTypes.shape({
    amount: PropTypes.oneOfType([
      PropTypes.string, PropTypes.instanceOf(Decimal),
    ]),
  }),
  predictedProfits: PropTypes.instanceOf(Decimal),
}

Metrics.defaultProps = {
  collateralToken: {
    amount: '0',
    symbol: 'N/A',
    address: undefined,
    icon: etherTokensIcon,
  },
  predictedProfits: undefined,
}

export default Metrics

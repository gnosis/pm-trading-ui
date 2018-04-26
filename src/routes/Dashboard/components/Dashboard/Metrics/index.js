import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import classnames from 'classnames/bind'

import outstandingPredictionsIconSrc from 'routes/Dashboard/assets/icon_outstandingPredictions.svg'
import etherTokensIconSrc from 'routes/Dashboard/assets/icon_etherTokens.svg'

import DecimalValue from 'components/DecimalValue'

import Metric from './Metric'
import style from './Metrics.mod.scss'

const cx = classnames.bind(style)

const Metrics = ({ collateralToken = {}, outstandingPredictions }) => (
  <div className={cx('metrics')}>
    <div className={cx('container')}>
      <Metric src={etherTokensIconSrc} explanation={`${collateralToken.symbol} tokens`}>
        <DecimalValue value={collateralToken.amount} className={cx('metric-value')} />&nbsp;
      </Metric>
      <Metric src={outstandingPredictionsIconSrc} explanation="Predicted Profits">
        <DecimalValue value={outstandingPredictions} className={cx('metric-value')} />
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
}

Metrics.defaultProps = {
  collateralToken: {
    amount: '0',
    symbol: 'N/A',
    address: undefined,
    icon: etherTokensIconSrc,
  },
}

export default Metrics

import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import classnames from 'classnames/bind'

import outstandingPredictionsIcon from 'routes/Dashboard/assets/icon_outstandingPredictions.svg'
import etherTokensIcon from 'routes/Dashboard/assets/icon_etherTokens.svg'

import CurrencyName from 'components/CurrencyName'
import DecimalValue from 'components/DecimalValue'
import Block from 'components/layout/Block'
import { weiToEth } from 'utils/helpers'
import { isFeatureEnabled } from 'utils/features'
import arrows from 'routes/Dashboard/assets/arrows.svg'

import Metric from './Metric'
import style from './Metrics.mod.scss'

const tournamentEnabled = isFeatureEnabled('tournament')

const cx = classnames.bind(style)

const Metrics = ({
  collateralToken = {}, predictedProfits, badge, rank,
}) => (
  <div className={cx('metrics')}>
    <div className={cx('container')}>
      <Metric
        isLoading={collateralToken.symbol === '/'}
        src={etherTokensIcon}
        explanation={`${collateralToken.symbol} tokens`}
      >
        <DecimalValue value={collateralToken.balance} className={cx('metric-value')} />&nbsp;
        <CurrencyName tokenAddress={collateralToken.address} />
      </Metric>
      <Metric
        isLoading={typeof predictedProfits === 'undefined'}
        src={outstandingPredictionsIcon}
        explanation="Predicted Profits"
      >
        <DecimalValue value={weiToEth(predictedProfits)} className={cx('metric-value')} />&nbsp;
        <CurrencyName tokenAddress={collateralToken.address} />
      </Metric>
      {tournamentEnabled && (
        <React.Fragment>
          <Metric isLoading={typeof rank === 'undefined'} src={arrows} explanation="YOUR RANK">
            <Block className={cx('ol-db-title')}>{rank || '--'}</Block>
          </Metric>
          <Metric
            isLoading={typeof badge.icon === 'undefined'}
            src={badge.icon}
            width={47}
            height={42}
            explanation="BADGE"
          >
            <Block className={cx('badgeTitle')}>{badge.rank}</Block>
          </Metric>
        </React.Fragment>
      )}
    </div>
  </div>
)

Metrics.propTypes = {
  collateralToken: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Decimal)]),
  }),
  predictedProfits: PropTypes.instanceOf(Decimal),
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  badge: PropTypes.shape({
    icon: PropTypes.string,
    maxPredictions: PropTypes.number,
    minPredictions: PropTypes.number,
    rank: PropTypes.string,
  }),
}

Metrics.defaultProps = {
  collateralToken: {
    amount: '0',
    symbol: 'N/A',
    address: undefined,
    icon: etherTokensIcon,
  },
  predictedProfits: undefined,
  rank: '',
  badge: {},
}

export default Metrics

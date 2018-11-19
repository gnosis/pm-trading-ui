import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import classnames from 'classnames/bind'
import { withNamespaces } from 'react-i18next'

import outstandingPredictionsIcon from 'routes/Dashboard/assets/icon_outstandingPredictions.svg'
import etherTokensIcon from 'routes/Dashboard/assets/icon_etherTokens.svg'

import DecimalValue from 'components/DecimalValue'
import Block from 'components/layout/Block'
import { weiToEth } from 'utils/helpers'
import { isFeatureEnabled } from 'utils/features'
import arrows from 'routes/Dashboard/assets/arrows.svg'

import Metric from './Metric'
import style from './Metrics.scss'

const tournamentEnabled = isFeatureEnabled('tournament')
const badgesEnabled = isFeatureEnabled('badges')

const cx = classnames.bind(style)

const Metrics = ({
  collateralToken, predictedProfits, badge, rank, t,
}) => (
  <div className={cx('metrics')}>
    <div className={cx('container')}>
      <div className={cx('row')}>
        <div className={cx('col-xs-12')}>
          <div className={cx('inner')}>
            <Metric
              isLoading={collateralToken.symbol === '/'}
              src={collateralToken.icon}
              explanation={t('dashboard.collateral_token_balance', { symbol: collateralToken.symbol })}
            >
              <DecimalValue value={collateralToken.balance} className={cx('metric-value')} />&nbsp;
              {collateralToken.symbol}
            </Metric>
            <Metric
              isLoading={typeof predictedProfits === 'undefined'}
              src={outstandingPredictionsIcon}
              explanation={(t('dashboard.predicted_profits'))}
            >
              <DecimalValue value={weiToEth(predictedProfits)} className={cx('metric-value')} />&nbsp;
              {collateralToken.symbol}
            </Metric>
            {tournamentEnabled && (
              <>
                <Metric isLoading={typeof rank === 'undefined'} src={arrows} explanation={t('dashboard.your_rank')}>
                  <Block className={cx('ol-db-title')}>{rank || '--'}</Block>
                </Metric>
                {badgesEnabled && (
                  <Metric
                    isLoading={typeof badge.icon === 'undefined'}
                    src={badge.icon}
                    width={47}
                    height={42}
                    explanation={(t('dashboard.badge'))}
                  >
                    <Block className={cx('badgeTitle')}>{badge.rank}</Block>
                  </Metric>
                )}
              </>
            )}
          </div>
        </div>
      </div>
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
  t: PropTypes.func.isRequired,
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

export default withNamespaces()(Metrics)

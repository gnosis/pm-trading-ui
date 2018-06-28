import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import classNames from 'classnames/bind'
import DecimalValue from 'components/DecimalValue'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import { isFeatureEnabled } from 'utils/features'
import * as css from './index.css'
import selector from './selector'

const tournamentEnabled = isFeatureEnabled('tournament')

const cx = classNames.bind(css)

const arrows = require('./assets/arrows.svg')
const etherTokens = require('./assets/icon_etherTokens.svg')
const outstandingPredictions = require('./assets/icon_outstandingPredictions.svg')

const Metric = ({
  img, explanation, children, width, height, tokenSymbol, ...props
}) => (
  <Block className={cx('ol-db-metric')} {...props}>
    <Img className={cx('ol-db-icon')} src={img} width={width} height={width} />
    <Block>
      {children}
      <Block className={cx('ol-db-explanation')}>
        {explanation}
      </Block>
    </Block>
  </Block>
)

Metric.propTypes = {
  img: PropTypes.string.isRequired,
  explanation: PropTypes.string,
  children: PropTypes.node,
  width: PropTypes.number,
  height: PropTypes.number,
  tokenSymbol: PropTypes.string,
}

Metric.defaultProps = {
  explanation: '',
  children: <div />,
  width: 37,
  height: 37,
  tokenSymbol: 'UNKNOWN',
}

const Metrics = ({
  predictedProfit, tokens, tokenSymbol, tokenIcon, rank, badge,
}) => (
  <Block className={cx('ol-db-container')} margin="md">
    <Metric img={tokenIcon} explanation={`${tokenSymbol} TOKENS`}>
      <span className={cx('ol-db-title')}>
        <DecimalValue value={tokens} />
        {' '}
        {tokenSymbol}
      </span>
    </Metric>
    <Metric img={outstandingPredictions} width={45} height={45} explanation="PREDICTED PROFITS">
      <Block className={cx('ol-db-title')}>
        {predictedProfit}
        {' '}
        {tokenSymbol}
      </Block>
    </Metric>
    {tournamentEnabled && (
      <React.Fragment>
        <Metric img={arrows} explanation="YOUR RANK">
          <Block className={cx('ol-db-title')}>
            {rank || '--'}
          </Block>
        </Metric>
        <Metric img={badge.icon} width={47} height={42} explanation="BADGE">
          <Block className={cx('ol-db-title', 'ol-db-title-badge')}>
            {badge.rank}
          </Block>
        </Metric>
      </React.Fragment>
    )}
  </Block>
)

Metrics.propTypes = {
  predictedProfit: PropTypes.string,
  tokens: PropTypes.oneOfType([PropTypes.instanceOf(Decimal), PropTypes.string, PropTypes.number]),
  tokenSymbol: PropTypes.string,
  tokenIcon: PropTypes.string,
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  badge: PropTypes.shape({
    icon: PropTypes.string,
    maxPredictions: PropTypes.number,
    minPredictions: PropTypes.number,
    rank: PropTypes.string,
  }),
}

Metrics.defaultProps = {
  predictedProfit: '--',
  tokens: Decimal(0),
  tokenSymbol: 'UNKNOWN',
  tokenIcon: etherTokens,
  rank: '',
  badge: {},
}

export default connect(selector)(Metrics)

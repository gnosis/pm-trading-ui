import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import classNames from 'classnames/bind'
import DecimalValue from 'components/DecimalValue'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import { isFeatureEnabled } from 'utils/features'
import * as css from './index.css'

const tournamentEnabled = isFeatureEnabled('tournament')

const cx = classNames.bind(css)

const arrows = require('./assets/bitcoin.svg')
const etherTokens = require('./assets/monero.svg')
const outstandingPredictions = require('./assets/monero.svg')

const Metric = ({
  img, explanation, children, width, height, tokenSymbol, ...props
}) => (
  <Block className={cx('ol-db-metric')} {...props}>
    <Img className={cx('ol-db-icon')} src={img} width={width} height={width} />
    <Block>
      {children}
      <Block className={cx('ol-db-explanation')}>{explanation}</Block>
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
    <Metric img={etherTokens} width={45} height={45} explanation={`${tokenSymbol} Ether Balance`}>
      <DecimalValue value={tokens} className={cx('ol-db-title')} />
    </Metric>
    <Metric img={outstandingPredictions} width={45} height={45} explanation="Research Token Balance">
      <Block className={cx('ol-db-title')}>{predictedProfit}</Block>
    </Metric>
    {tournamentEnabled && (
      <React.Fragment>
        <Metric img={arrows} explanation="YOUR RANK">
          <Block className={cx('ol-db-title')}>{rank || '--'}</Block>
        </Metric>
        <Metric img={badge.icon} width={47} height={42} explanation="BADGE">
          <Block className={cx('ol-db-title', 'ol-db-title-badge')}>{badge.rank}</Block>
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
  }).isRequired,
}

Metrics.defaultProps = {
  predictedProfit: '--',
  tokens: Decimal(0),
  tokenSymbol: 'UNKNOWN',
  tokenIcon: etherTokens,
  rank: '',
}

export default Metrics

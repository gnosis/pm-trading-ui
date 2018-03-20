import classNames from 'classnames/bind'
import DecimalValue from 'components/DecimalValue'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import * as React from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

const etherTokens = require('./assets/icon_etherTokens.svg')
const outstandingPredictions = require('./assets/icon_outstandingPredictions.svg')

const Metric = ({
  img, title, explanation, children, width = 37, height = 37, tokenSymbol, ...props
}) => (
  <Block className={cx('ol-db-metric')} {...props}>
    <Img className={cx('ol-db-icon')} src={img} width={width} height={width} />
    <Block>
      {children}
      <Block className={cx('ol-db-explanation')}>{explanation}</Block>
    </Block>
  </Block>
)

const Metrics = ({ tokens, predictedProfit, tokenSymbol }) => (
  <Block className={cx('ol-db-container')} margin="md">
    <Metric img={etherTokens} explanation={`${tokenSymbol} TOKENS`}>
      <DecimalValue value={tokens} className={cx('ol-db-title')} />
    </Metric>
    <Metric img={outstandingPredictions} width={45} height={45} explanation="PREDICTED PROFITS">
      <Block className={cx('ol-db-title')}>{predictedProfit || '--'}</Block>
    </Metric>
  </Block>
)

export default Metrics

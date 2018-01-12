import classNames from 'classnames/bind'
import Tooltip from 'rc-tooltip'
import DecimalValue from 'components/DecimalValue'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import * as React from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

const arrows = require('./assets/arrows.svg')
const group = require('./assets/group.png')
const shape = require('./assets/shape.svg')

const Metric = ({
  img, title, explanation, children, width = 37, height = 37, ...props
}) => (
  <Block className={cx('ol-db-metric')} {...props}>
    <Img
      className={cx('ol-db-icon')}
      src={img}
      width={width}
      height={width}
    />
    <Block>
      { children }
      <Block className={cx('ol-db-explanation')}>{ explanation }</Block>
    </Block>
  </Block>
)

const Metrics = ({
  tokens, predictedProfit, rank, badge,
}) => (
  <Block className={cx('ol-db-container')}>
    <Metric img={group} explanation="OLY TOKENS">
      <DecimalValue value={tokens} className={cx('ol-db-title')} />
    </Metric>
    <Tooltip placement="bottom" overlay="Updates every hour">
      <Metric img={shape} width={45} height={45} explanation="PREDICTED PROFITS">
        <Block className={cx('ol-db-title')}>{ predictedProfit ? predictedProfit.div(1e18).toDP(4, 1).toString() : '--' }</Block>
      </Metric>
    </Tooltip>
    <Metric img={arrows} explanation="YOUR RANK">
      <Block className={cx('ol-db-title')}>{ rank || '--' }</Block>
    </Metric>
    <Metric img={badge.icon} width={47} height={42} explanation="BADGE">
      <Block className={cx('ol-db-title', 'ol-db-title-badge')}>{ badge.name }</Block>
    </Metric>
  </Block>
)

export default Metrics

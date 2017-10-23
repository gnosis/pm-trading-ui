import classNames from 'classnames/bind'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import PageFrame from 'components/layout/PageFrame'
import * as React from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

const arrows = require('./assets/arrows.png')
const group = require('./assets/group.png')
const shape = require('./assets/shape.png')

const Metric = ({ img, title, explanation }) => (
    <Block className={ cx('ol-db-metric') }>
        <Img className={ cx('ol-db-icon') } src={ img } width="42" height="42" />
        <Block>
            <Block className={ cx('ol-db-title') }>{ title ? title : '--' }</Block>
            <Block className={ cx('ol-db-explanation') }>{ explanation }</Block>
        </Block>
    </Block>
)

const Metrics = ({ tokens, predictedProfits, rank }) => (
    <PageFrame>
        <Block className={ cx('dashboardStats', 'ol-db-container') }>
            <Metric img={ group } title={ tokens } explanation="OLY TOKENS" />
            <Metric img={ shape } title={ predictedProfits } explanation="PREIDCTED PROFITS" />
            <Metric img={ arrows} title={ rank } explanation="YOUR RANK" />
        </Block>
    </PageFrame>
)

export default Metrics

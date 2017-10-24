import classNames from 'classnames/bind'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import * as React from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

const arrows = require('./assets/arrows.png')
const group = require('./assets/group.png')
const shape = require('./assets/shape.png')

const Metric = ({ img, title, explanation, width = 37, height = 37 }) => (
    <Block className={ cx('ol-db-metric') }>
        <Img
            className={ cx('ol-db-icon') }
            src={ img }
            width={ width }
            height={ width }
        />
        <Block>
            <Block className={ cx('ol-db-title') }>{ title ? title : '--' }</Block>
            <Block className={ cx('ol-db-explanation') }>{ explanation }</Block>
        </Block>
    </Block>
)

const Metrics = ({ tokens, predictedProfits, rank }) => (
    <Block className={ cx('ol-db-container') }>
        <Metric img={ group } title={ tokens } explanation="OLY TOKENS" />
        <Metric img={ shape } width={ 45 } height={ 45 } title={ predictedProfits } explanation="PREDICTED PROFITS" />
        <Metric img={ arrows} title={ rank } explanation="YOUR RANK" />
    </Block>
)

export default Metrics

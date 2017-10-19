import classNames from 'classnames/bind'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import Paragraph from 'components/layout/Paragraph'
import * as React from 'react'
import * as css from './index.css'
import ScoreTable from './ScoreTable'

const cx = classNames.bind(css)
const trophy = require('../assets/trophy.svg')

const Layout = ({data, myWallet}) =>
    <Block>
        <Block className={ cx('trophy') }>
            <Img src={ trophy } width="100" />
            <Paragraph>Scoreboard</Paragraph>
        </Block>
        <Paragraph className={ cx('explanation') }>
            The total score is calculated based on the sum of predicted profits and OLY 
            tokens each wallet holds. Scores updated every hour.
        </Paragraph>
        <ScoreTable tableData={ data } myWallet={ myWallet } />
    </Block>

export default Layout

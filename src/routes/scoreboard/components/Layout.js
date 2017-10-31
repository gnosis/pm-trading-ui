import classNames from 'classnames/bind'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import PageFrame from 'components/layout/PageFrame'
import Paragraph from 'components/layout/Paragraph'
import * as React from 'react'
import * as css from './index.css'
import ScoreTable from './ScoreTable'

const cx = classNames.bind(css)
const trophy = require('../assets/trophy.svg')

class Layout extends React.PureComponent {

    render() { 
        const { data, myAccount } = this.props
        const hasRows = !!data

        return (
            <PageFrame>
                <Block className={ cx('trophy') }>
                    <Img src={ trophy } width="100" />
                    <Paragraph>Scoreboard</Paragraph>
                </Block>
                <Paragraph className={ cx('explanation') }>
                    The total score is calculated based on the sum of predicted profits and OLY 
                    tokens each wallet holds. Scores updated every hour.
                </Paragraph>
                <ScoreTable tableData={ data } myAccount={ myAccount } />
                { hasRows
                    ? <Block className={ cx('ol-account') }>
                        <Block className={ cx('dot') }/>
                        <Paragraph className={ cx('your') }>
                            = YOUR ACCOUNT
                        </Paragraph>
                    </Block>
                    : <Paragraph className={ cx('norows') }>
                        No rows found
                    </Paragraph>
                }
            </PageFrame>
        )
    }
}

export default Layout

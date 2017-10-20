import classNames from 'classnames/bind'
import Block from 'components/layout/Block'
import Img from 'components/layout/Img'
import Paragraph from 'components/layout/Paragraph'
import * as React from 'react'
import * as css from './index.css'
import ScoreTable from './ScoreTable'

const cx = classNames.bind(css)
const trophy = require('../assets/trophy.svg')

const calculateDataTable = (data, myPosition, containsAccount) => {
    let dataTable = data.slice(0, 10)
    
    if (!containsAccount) {
        dataTable.splice(11, 0, myPosition)
    }

    return dataTable;
}

class Layout extends React.PureComponent {

    render() { 
        const {data, myPosition, containsAccount} = this.props; 
        const dataTable = calculateDataTable(data, myPosition, containsAccount); 
        let myAccount = myPosition.account;

        return (
            <Block>
                <Block className={ cx('trophy') }>
                    <Img src={ trophy } width="100" />
                    <Paragraph>Scoreboard</Paragraph>
                </Block>
                <Paragraph className={ cx('explanation') }>
                    The total score is calculated based on the sum of predicted profits and OLY 
                    tokens each wallet holds. Scores updated every hour.
                </Paragraph>
                <ScoreTable tableData={ dataTable } myAccount={ myAccount } />
                <Block className={ cx('account') }>
                    <Block className={ cx('dot') }/>
                    <Paragraph className={ cx('your') }>
                        = YOUR ACCOUNT
                    </Paragraph>
                </Block>
            </Block>
        )
    }
}

export default Layout

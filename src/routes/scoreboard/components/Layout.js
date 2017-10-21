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

const calculateDataTable = (data, myPosition, containsAccount) => {
    if (!data) {
        return undefined
    }

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
        let myAccount = myPosition ? myPosition.account : undefined;
        const noRows = !dataTable;

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
                <ScoreTable tableData={ dataTable } myAccount={ myAccount } />
                { noRows && <Paragraph>No rows found</Paragraph> }
                <Block className={ cx('ol-account') }>
                    <Block className={ cx('dot') }/>
                    <Paragraph className={ cx('your') }>
                        = YOUR ACCOUNT
                    </Paragraph>
                </Block>
            </PageFrame>
        )
    }
}

export default Layout

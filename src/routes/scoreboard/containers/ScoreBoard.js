import * as React from 'react'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import actions from './actions'
import selector from './selector'

class ScoreBoard extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        this.props.fetchOlympiaUsers()
        this.props.addUsers([{
            currentRank: 19,
            diffRank: 10,
            pastRank: 29,
            account: this.props.myAccount,
            score: '454000000000000000',
            balance: '100000000000000000',
            predictedProfit: '354000000000000000',
            predictions: 12,
        }])
    }

    render() {
        const { data, myAccount } = this.props;

        return <Layout data={ data } myAccount={ myAccount } />
    }
}

export default connect(selector, actions)(ScoreBoard)

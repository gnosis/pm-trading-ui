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
        this.props.fetchOlympiaUsers();
    }

    render() {
        const { data, myPosition, containsAccount } = this.props;

        return <Layout data={ data } myPosition={ myPosition } containsAccount={ containsAccount } />
    }
}

export default connect(selector, actions)(ScoreBoard)

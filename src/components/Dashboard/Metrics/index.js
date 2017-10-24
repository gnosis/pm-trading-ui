import * as React from 'react';
import { connect } from 'react-redux'
import Layout from './Layout'
import selector from './selector'
class Metrics extends React.PureComponent {

    render() {
        const { tokens, predictedProfits, rank } = this.props
        
        return (
            <Layout tokens={ tokens } predictedProfits={ predictedProfits } rank={ rank } />
        );
    }
}

export default connect(selector)(Metrics)

import * as React from 'react';
import { connect } from 'react-redux'
import Layout from './Layout'
import selector from './selector'

class Metrics extends React.PureComponent {

    render() {
        const { tokens, predictedProfits, rank, badge } = this.props
        
        return (
            <Layout
                tokens={ tokens }
                predictedProfits={ predictedProfits }
                rank={ rank }
                badge={ badge }
            />
        );
    }
}

export default connect(selector)(Metrics)

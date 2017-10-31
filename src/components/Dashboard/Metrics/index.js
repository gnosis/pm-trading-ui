import * as React from 'react';
import { connect } from 'react-redux'
import Layout from './Layout'
import selector from './selector'

class Metrics extends React.PureComponent {

    render() {
        const { tokens, predictedProfit, rank, badge } = this.props
        
        return (
            <Layout
                tokens={ tokens }
                predictedProfit={ predictedProfit }
                rank={ rank }
                badge={ badge }
            />
        );
    }
}

export default connect(selector)(Metrics)

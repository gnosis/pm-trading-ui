import * as React from 'react';
import { connect } from 'react-redux'
import Layout from './Layout'

class Metrics extends React.PureComponent {

    render() {
        return (
            <Layout tokens="200" predictedProfits={ -32 } rank={ 23 } />
        );
    }
}

export default connect()(Metrics)

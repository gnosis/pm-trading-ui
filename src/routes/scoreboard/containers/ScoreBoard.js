import PropTypes from 'prop-types'
import * as React from 'react'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import actions from './actions'
import selector from './selector'

class ScoreBoard extends React.Component {

    componentDidMount() {
        this.props.fetchOlympiaUsers()
    }

    render() {
        const { data, myAccount } = this.props

        return <Layout data={data} myAccount={myAccount} />
    }
}

ScoreBoard.propTypes = {
    data: PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.object,
        PropTypes.bool,
    ])),
    myAccount: PropTypes.string,
    fetchOlympiaUsers: PropTypes.func.isRequired,
}

export default connect(selector, actions)(ScoreBoard)

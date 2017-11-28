import ImmutablePropTypes from 'react-immutable-proptypes'
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
  data: ImmutablePropTypes.listOf(ImmutablePropTypes.contains({
    currentRank: PropTypes.number.isRequired,
    diffRank: PropTypes.number.isRequired,
    pastRank: PropTypes.number.isRequired,
    account: PropTypes.string.isRequired,
    score: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    predictedProfit: PropTypes.string.isRequired,
    predictions: PropTypes.string.number,
  })),
  myAccount: PropTypes.string,
  fetchOlympiaUsers: PropTypes.func.isRequired,
}

ScoreBoard.defaultProps = {
  data: [],
  myAccount: 'Unknown',
}

export default connect(selector, actions)(ScoreBoard)

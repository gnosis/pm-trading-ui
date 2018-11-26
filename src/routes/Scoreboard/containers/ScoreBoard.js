import ImmutablePropTypes from 'react-immutable-proptypes'
import { List } from 'immutable'
import PropTypes from 'prop-types'
import * as React from 'react'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import actions from './actions'
import selector from './selector'

class ScoreBoard extends React.Component {
  componentDidMount() {
    const {
      myAccount, fetchTournamentUsers, updateCollateralToken, fetchTournamentUserData,
    } = this.props
    fetchTournamentUsers()
    if (myAccount) {
      updateCollateralToken()
      fetchTournamentUserData(myAccount)
    }
  }

  render() {
    const {
      data, myAccount, mainnetAddress, openSetMainnetAddressModal, openClaimRewardModal, rank, hasClaimedReward, collateralToken,
    } = this.props

    return (
      <Layout
        data={data}
        myAccount={myAccount}
        mainnetAddress={mainnetAddress}
        openSetMainnetAddressModal={openSetMainnetAddressModal}
        openClaimRewardModal={openClaimRewardModal}
        rank={rank}
        hasClaimedReward={hasClaimedReward}
        collateralToken={collateralToken}
      />
    )
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
  mainnetAddress: PropTypes.string,
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fetchTournamentUsers: PropTypes.func.isRequired,
  openSetMainnetAddressModal: PropTypes.func.isRequired,
  openClaimRewardModal: PropTypes.func.isRequired,
  fetchTournamentUserData: PropTypes.func.isRequired,
  updateCollateralToken: PropTypes.func.isRequired,
  hasClaimedReward: PropTypes.bool.isRequired,
  collateralToken: PropTypes.shape({
    symbol: PropTypes.string,
  }),
}

ScoreBoard.defaultProps = {
  data: List(),
  myAccount: '',
  mainnetAddress: undefined,
  rank: '',
  collateralToken: {
    symbol: 'N/A',
    balance: 0,
    address: undefined,
  },
}

export default connect(selector, actions)(ScoreBoard)

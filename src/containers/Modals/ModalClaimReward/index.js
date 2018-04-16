import ClaimReward from 'components/ModalContent/ClaimReward'
import { requestGasPrice } from 'actions/blockchain'
import { connect } from 'react-redux'
import {
  getCurrentAccount,
  getCurrentBalance,
  getCurrentNetwork,
  getCurrentNetworkId,
} from 'integrations/store/selectors'
import { getGasPrice } from 'routes/MarketDetails/store/selectors'
import { claimUserRewards } from 'actions/rewards'
import { getRewardClaimOptions } from 'utils/configuration'
import { requestClaimRewardGasCost } from './action'
import { getClaimRewardGasCost, getRewardValue } from './selectors'

const { contractAddress } = getRewardClaimOptions()

const mapStateToProps = state => ({
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
  gasPrice: getGasPrice(state),
  currentNetwork: getCurrentNetwork(state),
  currentNetworkId: getCurrentNetworkId(state),
  claimRewardGasCost: getClaimRewardGasCost(state),
  rewardValue: getRewardValue(state),
})

const mapDispatchToProps = dispatch => ({
  requestGasPrice: () => dispatch(requestGasPrice()),
  requestClaimRewardGasCost: () => dispatch(requestClaimRewardGasCost()),
  claimUserRewards: () => dispatch(claimUserRewards(contractAddress)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClaimReward)

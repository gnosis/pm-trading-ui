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

const { contractAddress } = getRewardClaimOptions()

const mapStateToProps = state => ({
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
  gasPrice: getGasPrice(state),
  currentNetwork: getCurrentNetwork(state),
  currentNetworkId: getCurrentNetworkId(state),
})

const mapDispatchToProps = dispatch => ({
  requestGasPrice: () => dispatch(requestGasPrice()),
  claimUserRewards: () => dispatch(claimUserRewards(contractAddress)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClaimReward)

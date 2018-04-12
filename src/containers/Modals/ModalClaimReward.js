import ClaimReward from 'components/ModalContent/ClaimReward'
import { requestGasPrice } from 'actions/blockchain'
import { connect } from 'react-redux'
import {
  getCurrentAccount,
  getCurrentBalance,
  getCurrentNetwork,
  getTargetNetworkId,
  getCurrentNetworkId,
} from 'integrations/store/selectors'
import { getGasPrice } from 'routes/MarketDetails/store/selectors'
// import { requestRegistrationGasCost } from './actions'
// import { getRegistrationGasCost } from './selectors'

const mapStateToProps = state => ({
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
  gasPrice: getGasPrice(state),
  currentNetwork: getCurrentNetwork(state),
  targetNetworkId: getTargetNetworkId(state),
  currentNetworkId: getCurrentNetworkId(state),
})

const mapDispatchToProps = dispatch => ({
  requestGasPrice: () => dispatch(requestGasPrice()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ClaimReward)

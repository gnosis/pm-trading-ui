import ClaimReward from 'components/ModalContent/ClaimReward'
import { requestGasPrice } from 'store/actions/blockchain'
import { connect } from 'react-redux'
import {
  getCurrentAccount,
  getCurrentBalance,
  getCurrentNetwork,
  getCurrentNetworkId,
} from 'integrations/store/selectors'
import { getGasPrice } from 'routes/MarketDetails/store/selectors'
import { claimUserRewards } from 'store/actions/rewards'
import { getFeatureConfig } from 'utils/features'
import { requestClaimRewardGasCost } from './action'
import { getClaimRewardGasCost, getRewardValue } from './selectors'

const { claimReward } = getFeatureConfig('rewards')

const mapStateToProps = state => ({
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
  gasPrice: getGasPrice(state),
  currentNetwork: getCurrentNetwork(state),
  currentNetworkId: getCurrentNetworkId(state),
  claimRewardGasCost: getClaimRewardGasCost(state),
  rewardValue: getRewardValue(state),
})

const mapDispatchToProps = {
  requestGasPrice,
  requestClaimRewardGasCost,
  claimUserRewards: () => claimUserRewards(claimReward.contractAddress),
}

export default connect(mapStateToProps, mapDispatchToProps)(ClaimReward)

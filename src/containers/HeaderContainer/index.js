import { connect } from 'react-redux'
import { openModal } from 'actions/modal'
import { requestMainnetAddress } from 'actions/account'
import { initProviders } from 'integrations/store/actions'
import { withRouter } from 'react-router-dom'
import { meSelector } from 'routes/Scoreboard/store/selectors'
import { getTokenAmount } from 'selectors/blockchain'
import { requestTokenBalance } from 'actions/blockchain'

import Header from 'components/Header'

import {
  getCurrentNetwork,
  getCurrentAccount,
  getActiveProvider,
  checkWalletConnection,
  isConnectedToCorrectNetwork,
  getTargetNetworkId,
  getRegisteredMainnetAddress,
  isMetamaskLocked,
} from 'integrations/store/selectors'
import {
  isTournament,
  getLogoPath,
  getSmallLogoPath,
  shallShowScoreboard,
  shallShowGameGuide,
  getGameGuideType,
  getGameGuideURL,
  getTokenAddress,
} from 'utils/configuration'
import { WALLET_PROVIDER } from 'integrations/constants'

const mapStateToProps = state => ({
  hasWallet: checkWalletConnection(state),
  currentAccount: getCurrentAccount(state),
  currentBalance: getTokenAmount(state, getTokenAddress()).toString(),
  currentNetwork: getCurrentNetwork(state),
  currentProvider: getActiveProvider(state),
  isConnectedToCorrectNetwork: isConnectedToCorrectNetwork(state),
  targetNetworkId: getTargetNetworkId(state),
  mainnetAddress: getRegisteredMainnetAddress(state),
  lockedMetamask: isMetamaskLocked(state),
  isTournament: isTournament(),
  userTournamentInfo: meSelector(state),
  logoPath: getLogoPath(),
  smallLogoPath: getSmallLogoPath(),
  showScoreboard: shallShowScoreboard(),
  showGameGuide: shallShowGameGuide(),
  gameGuideType: getGameGuideType(),
  gameGuideURL: getGameGuideURL(),
  tokenAddress: getTokenAddress(),
})

const mapDispatchToProps = dispatch => ({
  requestMainnetAddress: () => dispatch(requestMainnetAddress()),
  requestTokenBalance: account => dispatch(requestTokenBalance(getTokenAddress(), account)),
  openModal: modalName => dispatch(openModal({ modalName })),
  initUport: () => dispatch(initProviders({ providers: [WALLET_PROVIDER.UPORT] })),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

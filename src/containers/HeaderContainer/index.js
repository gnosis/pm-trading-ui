import { connect } from 'react-redux'
import { openModal } from 'actions/modal'
import { requestMainnetAddress } from 'actions/account'
import { initProviders } from 'integrations/store/actions'
import { withRouter } from 'react-router-dom'
import { meSelector } from 'routes/Scoreboard/store/selectors'

import Header from 'components/Header'

import {
  getCurrentBalance,
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
  currentBalance: getCurrentBalance(state),
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
  openModal: modalName => dispatch(openModal({ modalName })),
  initUport: () => dispatch(initProviders({ providers: [WALLET_PROVIDER.UPORT] })),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

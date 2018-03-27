import { connect } from 'react-redux'
import { openModal } from 'actions/modal'
import { withRouter } from 'react-router-dom'

import Header from 'components/Header'

import {
  getCurrentBalance,
  getCurrentNetwork,
  getCurrentAccount,
  getActiveProvider,
  checkWalletConnection,
  isConnectedToCorrectNetwork,
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

const mapStateToProps = state => ({
  hasWallet: checkWalletConnection(state),
  currentAccount: getCurrentAccount(state),
  currentBalance: getCurrentBalance(state),
  currentNetwork: getCurrentNetwork(state),
  currentProvider: getActiveProvider(state),
  isConnectedToCorrectNetwork: isConnectedToCorrectNetwork(state),
  isTournament: isTournament(),
  logoPath: getLogoPath(),
  smallLogoPath: getSmallLogoPath(),
  showScoreboard: shallShowScoreboard(),
  showGameGuide: shallShowGameGuide(),
  gameGuideType: getGameGuideType(),
  gameGuideURL: getGameGuideURL(),
  tokenAddress: getTokenAddress(),
})

const mapDispatchToProps = dispatch => ({
  openInstallMetamaskModal: () => dispatch(openModal({ modalName: 'ModalInstallMetamask' })),
  openUnlockMetamaskModal: () => dispatch(openModal({ modalName: 'ModalUnlockMetamask' })),
  openSwitchNetworkModal: () => dispatch(openModal({ modalName: 'ModalSwitchNetwork' })),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

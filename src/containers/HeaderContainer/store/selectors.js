import Decimal from 'decimal.js'

import {
  getCurrentAccount,
  getCurrentNetwork,
  getCurrentBalance,
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

import { getTokenAmount } from 'selectors/blockchain'

import { meSelector } from 'routes/Scoreboard/store/selectors'

/**
 * Returns either the balance of the counfigured token of the current balance of ether
 * @param {*} state
 */
const getCurrentTokenBalance = (state) => {
  const platformToken = getTokenAddress()

  if (!platformToken) {
    return getCurrentBalance(state)
  }

  const amount = getTokenAmount(state, getTokenAddress())

  if (!amount) {
    return Decimal(0)
  }

  return amount.toString()
}

export default state => ({
  hasWallet: checkWalletConnection(state),
  currentAccount: getCurrentAccount(state),
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
  tokenBalance: getCurrentTokenBalance(state),
})


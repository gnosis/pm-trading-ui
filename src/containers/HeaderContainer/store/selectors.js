import {
  getCurrentAccount,
  getCurrentNetwork,
  getActiveProvider,
  checkWalletConnection,
  isConnectedToCorrectNetwork,
  getTargetNetworkId,
  getRegisteredMainnetAddress,
  isMetamaskLocked,
  hasAcceptedTermsAndConditions,
} from 'integrations/store/selectors'

import {
  getLogoConfig,
  isFeatureEnabled,
  getFeatureConfig,
} from 'utils/features'

import { getCollateralToken } from 'store/selectors/blockchain'

import { meSelector } from 'routes/Scoreboard/store/selectors'

const gameGuideConfig = getFeatureConfig('gameGuide')
const logoConfig = getLogoConfig('logo')

/**
 * Returns either the balance of the counfigured token of the current balance of ether
 * @param {*} state
 */

export default (state) => {
  const collateralToken = getCollateralToken(state)

  return {
    hasWallet: checkWalletConnection(state),
    currentAccount: getCurrentAccount(state),
    currentNetwork: getCurrentNetwork(state),
    currentProvider: getActiveProvider(state),
    isConnectedToCorrectNetwork: isConnectedToCorrectNetwork(state),
    targetNetworkId: getTargetNetworkId(state),
    mainnetAddress: getRegisteredMainnetAddress(state),
    lockedMetamask: isMetamaskLocked(state),
    userTournamentInfo: meSelector(state),
    logoPath: logoConfig.regular,
    smallLogoPath: logoConfig.small,
    showScoreboard: isFeatureEnabled('scoreboard'),
    showGameGuide: isFeatureEnabled('gameGuide'),
    gameGuideType: gameGuideConfig.type,
    gameGuideURL: gameGuideConfig.url,
    tokenAddress: collateralToken.address,
    tokenBalance: collateralToken.balance,
    acceptedTOS: hasAcceptedTermsAndConditions(state),
  }
}

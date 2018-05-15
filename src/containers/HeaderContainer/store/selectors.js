import Decimal from 'decimal.js'
import { formValueSelector } from 'redux-form'

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
  getLogoConfig,
  isFeatureEnabled,
  getFeatureConfig,
  getCollateralToken,
} from 'utils/features'

import { getTokenAmount } from 'store/selectors/blockchain'

import { meSelector } from 'routes/Scoreboard/store/selectors'

const collateralToken = getCollateralToken()
const gameGuideConfig = getFeatureConfig('gameGuide')
const logoConfig = getLogoConfig('logo')

const getTOSStatus = (state) => {
  const getFormValue = formValueSelector('tosAgreement')

  return (
    !!getFormValue(state, 'agreedWithTOS') &&
    !!getFormValue(state, 'agreedWithPP') &&
    !!getFormValue(state, 'agreedWithRDP')
  )
}

/**
 * Returns either the balance of the counfigured token of the current balance of ether
 * @param {*} state
 */
const getCurrentTokenBalance = (state) => {
  if (!collateralToken) {
    return getCurrentBalance(state)
  }

  const amount = getTokenAmount(state, collateralToken.address)

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
  userTournamentInfo: meSelector(state),
  logoPath: logoConfig.regular,
  smallLogoPath: logoConfig.small,
  showScoreboard: isFeatureEnabled('scoreboard'),
  showGameGuide: isFeatureEnabled('gameGuide'),
  gameGuideType: gameGuideConfig.type,
  gameGuideURL: gameGuideConfig.url,
  tokenAddress: collateralToken && collateralToken.address,
  tokenBalance: getCurrentTokenBalance(state),
  acceptedTOS: getTOSStatus(state),
})


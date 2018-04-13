import { requestTokenBalance } from 'actions/blockchain'
import { openModal } from 'actions/modal'
import { requestMainnetAddress } from 'actions/account'

import { initProviders } from 'integrations/store/actions'
import { WALLET_PROVIDER } from 'integrations/constants'

import { getTokenAddress } from 'utils/configuration'

/**
 * Requests the configured tournaments collateralToken balance. If none is set, does nothing
 * @param {function} dispatch
 */
const requestTournamentTokenBalance = dispatch => (account) => {
  const tournamentToken = getTokenAddress()

  if (!tournamentToken) {
    return null
  }

  return dispatch(requestTokenBalance(tournamentToken, account))
}

export default dispatch => ({
  requestMainnetAddress: () => dispatch(requestMainnetAddress()),
  requestTokenBalance: requestTournamentTokenBalance,
  openModal: modalName => dispatch(openModal({ modalName })),
  initUport: () => dispatch(initProviders({ providers: [WALLET_PROVIDER.UPORT] })),
})

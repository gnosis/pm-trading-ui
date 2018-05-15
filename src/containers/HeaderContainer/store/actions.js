import { requestTokenBalance } from 'actions/blockchain'
import { openModal } from 'actions/modal'
import { requestMainnetAddress } from 'actions/account'

import { initProviders } from 'integrations/store/actions'
import { WALLET_PROVIDER } from 'integrations/constants'

import { getCollateralToken } from 'utils/features'

/**
 * Requests the configured tournaments collateralToken balance. If none is set, does nothing
 * @param {function} dispatch
 */
const requestTournamentTokenBalance = dispatch => (account) => {
  const tournamentToken = getCollateralToken()

  if (!tournamentToken) {
    return null
  }

  return dispatch(requestTokenBalance(tournamentToken.address, account))
}

export default {
  requestMainnetAddress,
  requestTokenBalance: requestTournamentTokenBalance,
  openModal: modalName => dispatch => dispatch(openModal({ modalName })),
  initUport: () => dispatch => dispatch(initProviders({ providers: [WALLET_PROVIDER.UPORT] })),
}

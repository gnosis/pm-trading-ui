import { requestTokenBalance } from 'actions/blockchain'
import { openModal } from 'actions/modal'
import { requestMainnetAddress } from 'actions/account'

import { initProviders } from 'integrations/store/actions'
import { WALLET_PROVIDER } from 'integrations/constants'

import { getCollateralToken } from 'selectors/blockchain'

/**
 * Requests the configured tournaments collateralToken balance. If none is set, does nothing
 * @param {function} dispatch
 * @param {function} getState
 */
const requestTournamentTokenBalance = account => (dispatch, getState) => {
  const state = getState()
  const collateralToken = getCollateralToken(state)

  if (!collateralToken) {
    return undefined
  }

  return dispatch(requestTokenBalance(collateralToken.address, account))
}

export default {
  requestMainnetAddress,
  requestTokenBalance: requestTournamentTokenBalance,
  openModal: modalName => dispatch => dispatch(openModal({ modalName })),
  initUport: () => dispatch => dispatch(initProviders({ providers: [WALLET_PROVIDER.UPORT] })),
}

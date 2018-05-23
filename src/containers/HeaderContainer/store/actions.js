import { requestTokenBalance, TOKEN_SOURCE_ETH } from 'store/actions/blockchain'
import { openModal } from 'store/actions/modal'
import { requestMainnetAddress } from 'store/actions/account'

import { initProviders } from 'integrations/store/actions'
import { WALLET_PROVIDER } from 'integrations/constants'

import { getCollateralToken } from 'store/selectors/blockchain'

/**
 * Requests the configured tournaments collateralToken balance. If none is set, does nothing
 * @param {function} dispatch
 * @param {function} getState
 */
const requestCollateralTokenBalance = account => (dispatch, getState) => {
  const state = getState()
  const collateralToken = getCollateralToken(state)

  // no collateral token defined yet - this information might be asynchronous, if the
  // defined collateral token is inside a contract.
  if (!collateralToken || !collateralToken.source) {
    return undefined
  }

  // if the collateralToken source is the ETH balance from the users wallet, we don't need
  // to start a request to fetch the balance, as it is auto updating in the current provider
  if (collateralToken.source === TOKEN_SOURCE_ETH) {
    return undefined
  }

  return dispatch(requestTokenBalance(collateralToken.address, account))
}

export default {
  requestMainnetAddress,
  requestTokenBalance: requestCollateralTokenBalance,
  openModal: modalName => dispatch => dispatch(openModal({ modalName })),
  initUport: () => dispatch => dispatch(initProviders({ providers: [WALLET_PROVIDER.UPORT] })),
}

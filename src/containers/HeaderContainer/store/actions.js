import { requestCollateralTokenBalance } from 'store/actions/blockchain'
import { openModal } from 'store/actions/modal'
import { requestMainnetAddress } from 'store/actions/account'

import { initProviders } from 'integrations/store/actions'
import { WALLET_PROVIDER } from 'integrations/constants'
import { fetchTournamentUserData } from 'routes/Scoreboard/store'

export default {
  requestMainnetAddress,
  fetchTournamentUserData: accountAddress => dispatch => dispatch(fetchTournamentUserData(accountAddress)),
  requestTokenBalance: requestCollateralTokenBalance,
  openModal: modalName => dispatch => dispatch(openModal({ modalName })),
  initUport: () => dispatch => dispatch(initProviders({ providers: [WALLET_PROVIDER.UPORT] })),
}

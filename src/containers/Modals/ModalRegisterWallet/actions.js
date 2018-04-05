import { GAS_COST } from 'utils/constants'
import { setGasCost } from 'routes/MarketDetails/store/actions'
import { getCurrentAccount } from 'integrations/store/selectors'
import { calcRegistrationGasCost } from './api'

const contractType = GAS_COST.MAINNET_ADDRESS_REGISTRATION

const requestRegistrationGasCost = () => async (dispatch, getState) => {
  const account = getCurrentAccount(getState())
  const gasCost = await calcRegistrationGasCost(account)

  dispatch(setGasCost({ entityType: 'gasCosts', contractType, gasCost }))
}

export { requestRegistrationGasCost }

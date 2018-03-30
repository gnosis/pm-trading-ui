import { getMainnetAddressForRinkebyAccount } from 'api'
import { getActiveProvider } from 'integrations/store/selectors'
import { updateProvider } from 'integrations/store/actions'
import { getRegistrationContractAddress } from 'utils/configuration'

export const requestMainnetAddress = () => async (dispatch, getState) => {
  const state = getState()
  const { name: providerName, ...provider } = getActiveProvider(state)
  const registrationContractAddress = getRegistrationContractAddress()
  const mainnetAddress = await getMainnetAddressForRinkebyAccount(registrationContractAddress, provider.account)
  console.log('MAINNET ADDRESS REQUESTED')
  await dispatch(updateProvider({
    provider: providerName,
    ...provider,
    mainnetAddress,
  }))
}

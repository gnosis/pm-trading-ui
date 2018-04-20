import { getMainnetAddressForRinkebyAccount, setMainnetAddressForRinkebyAccount } from 'api'
import { getActiveProvider } from 'integrations/store/selectors'
import { updateProvider } from 'integrations/store/actions'
import { getFeatureConfig } from 'utils/features'

const tournamentConfig = getFeatureConfig('tournament')

export const requestMainnetAddress = () => async (dispatch, getState) => {
  const state = getState()
  const provider = getActiveProvider(state).toJS()
  const registrationContractAddress = tournamentConfig.registration.contractAddress
  const mainnetAddress = await getMainnetAddressForRinkebyAccount(registrationContractAddress, provider.account)
  dispatch(updateProvider({
    provider: provider.name,
    ...provider,
    mainnetAddress,
  }))
}

export const updateMainnetAddress = mainnetAddress => async (dispatch, getState) => {
  const state = getState()
  const provider = getActiveProvider(state).toJS()
  const registrationContractAddress = tournamentConfig.registration.contractAddress
  await setMainnetAddressForRinkebyAccount(registrationContractAddress, mainnetAddress)

  dispatch(updateProvider({
    provider: provider.name,
    ...provider,
    mainnetAddress,
  }))

  dispatch(requestMainnetAddress())
}

import { getMainnetAddressForRinkebyAccount, setMainnetAddressForRinkebyAccount } from 'api'
import { updateProvider } from 'integrations/store/actions'
import { getActiveProvider } from 'integrations/store/selectors'

export const requestMainnetAddress = () => async (dispatch, getState) => {
  const state = getState()
  const { name: providerName, ...provider } = getActiveProvider(state)
  const mainnetAddress = await getMainnetAddressForRinkebyAccount(provider.account)

  await dispatch(updateProvider({
    provider: providerName,
    ...provider,
    mainnetAddress,
  }))
}

export const updateMainnetAddress = mainnetAddress => async (dispatch, getState) => {
  const state = getState()
  const { name: providerName, ...provider } = getActiveProvider(state)

  await setMainnetAddressForRinkebyAccount(mainnetAddress)

  await dispatch(updateProvider({
    provider: providerName,
    ...provider,
    mainnetAddress,
  }))
}

import {
  getMainnetAddressForRinkebyAccount,
  setMainnetAddressForRinkebyAccount,
} from 'api'
import { updateProvider } from 'actions/providers'
import { getSelectedProvider } from 'selectors/blockchain'

export const requestMainnetAddress = () => async (dispatch, getState) => {
  const state = getState()
  const { name: providerName, ...provider } = getSelectedProvider(state)
  const mainnetAddress = await getMainnetAddressForRinkebyAccount(provider.account)

  await dispatch(updateProvider({
    provider: providerName,
    ...provider,
    mainnetAddress,
  }))
}

export const updateMainnetAddress = mainnetAddress => async (dispatch, getState) => {
  const state = getState()
  const { name: providerName, ...provider } = getSelectedProvider(state)

  await setMainnetAddressForRinkebyAccount(mainnetAddress)

  await dispatch(updateProvider({
    provider: providerName,
    ...provider,
    mainnetAddress,
  }))
}

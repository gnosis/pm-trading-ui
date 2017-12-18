import { createAction } from 'redux-actions'

import { UPORT_OLYMPIA_KEY } from 'integrations/uport/connector'
import { isGnosisInitialized, getSelectedProvider, initializedAllProviders } from 'selectors/blockchain'

import { initGnosis } from './blockchain'

export const registerProvider = createAction('REGISTER_PROVIDER')
export const updateProvider = createAction('UPDATE_PROVIDER')
export const logout = createAction('PROVIDER_LOGOUT')
export const setActiveProvider = createAction('SET_ACTIVE_PROVIDER')

const GNOSIS_REINIT_KEYS = ['network', 'account', 'available']

export const logoutProvider = () => async (dispatch, getState) => {
  const state = getState()
  const { name: providerName, ...provider } = getSelectedProvider(state)

  localStorage.removeItem(UPORT_OLYMPIA_KEY)

  await dispatch(logout(providerName))
  await dispatch(updateProvider({
    provider: providerName,
    ...provider,
    account: undefined,
    balance: undefined,
    network: undefined,
    available: false,
  }))
}

export const runProviderUpdate = (provider, data) => async (dispatch, getState) => {
  await dispatch(updateProvider({
    provider: provider.constructor.providerName,
    ...data,
  }))

  const state = getState()
  const isInitialized = isGnosisInitialized(state)

  if (isInitialized) {
    let requireGnosisReinit = false
    GNOSIS_REINIT_KEYS.forEach((searchKey) => {
      if (Object.keys(data).indexOf(searchKey) > -1) {
        requireGnosisReinit = true
      }
    })

    if (requireGnosisReinit) {
      // Just in case any other provider is updated and the default one
      // is UPORT we do not want to scan the code again
      await dispatch(initGnosis())
    }
  }

  if (!isInitialized) {
    const providersLoaded = initializedAllProviders(state)

    if (providersLoaded) {
      initGnosis()
    }
  }
}

export const runProviderRegister = (provider, data) => async (dispatch) => {
  const providerData = { ...data }
  await dispatch(registerProvider({
    provider: provider.constructor.providerName,
    ...providerData,
  }))
}

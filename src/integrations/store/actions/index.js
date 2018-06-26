import { createAction } from 'redux-actions'

import { isGnosisInitialized } from 'store/selectors/blockchain'
import { getActiveProvider, initializedAllProviders } from 'integrations/store/selectors'
import { WALLET_PROVIDER } from 'integrations/constants'
import { initGnosis } from 'store/actions/blockchain'
import { isFeatureEnabled } from 'utils/features'

export const registerProvider = createAction('REGISTER_PROVIDER')
export const updateProvider = createAction('UPDATE_PROVIDER')
export const logout = createAction('PROVIDER_LOGOUT')
export const setActiveProvider = createAction('SET_ACTIVE_PROVIDER')
export const initProviders = createAction('INIT_PROVIDERS')
export const setLegalDocumentsAccepted = createAction('SET_LEGAL_DOCUMENTS_ACCEPTED')

const GNOSIS_REINIT_KEYS = ['network', 'account', 'available']

export const logoutProvider = () => async (dispatch, getState) => {
  const state = getState()
  const { name: providerName } = getActiveProvider(state)

  localStorage.removeItem(`GNOSIS_${process.env.VERSION}`)

  await dispatch(logout(providerName))
}

export const runProviderUpdate = (provider, data) => async (dispatch, getState) => {
  if (provider.constructor.providerName === WALLET_PROVIDER.METAMASK && isFeatureEnabled('tournament')) {
    if (data.account === null) {
      dispatch(updateProvider({
        provider: provider.constructor.providerName,
        mainnetAddress: null,
      }))
    }
  }

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
      await dispatch(initGnosis())
    }
  }

  if (!isInitialized) {
    const providersLoaded = initializedAllProviders(state)

    if (providersLoaded) {
      await dispatch(initGnosis())
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

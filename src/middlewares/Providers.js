import * as walletIntegrations from 'integrations'
import { initGnosis } from 'actions/blockchain'
import { runProviderRegister, runProviderUpdate } from 'actions/providers'
import { map } from 'lodash'

export default store => next => (action) => {
  const handledAction = next(action)
  const { dispatch, getState } = store
  const { type, payload } = action

  if (type === 'INIT_PROVIDERS') {
    const providerOptions = {
      runProviderUpdate: (provider, data) => dispatch(runProviderUpdate(provider, data)),
      runProviderRegister: (provider, data) => dispatch(runProviderRegister(provider, data)),
      initGnosis: () => dispatch(initGnosis()),
      dispatch,
    }

    Promise.all(map(walletIntegrations, integration => integration.initialize(providerOptions)))
  }

  if (type === 'PROVIDER_LOGOUT') {
    Object.keys(walletIntegrations).forEach((providerName) => {
      const integration = walletIntegrations[providerName]

      if (integration.constructor.providerName === payload) {
        integration.logout()
      }
    })
  }

  return handledAction
}

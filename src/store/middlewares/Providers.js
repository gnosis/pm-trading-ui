import integrations from 'integrations'
import { initGnosis } from 'store/actions/blockchain'
import { runProviderRegister, runProviderUpdate } from 'integrations/store/actions'
import { getProviderConfig } from 'utils/features'
import { map } from 'lodash'

const providers = getProviderConfig()

if (!providers.length) {
  console.error(`No providers specified. It means you won't be able to interact with the application.
  You need to configure providers, please check our docs for details: https://gnosis-apollo.readthedocs.io/en/latest/index.html`)
}

export default store => next => (action) => {
  const handledAction = next(action)
  const { dispatch } = store
  const { type, payload } = action

  if (type === 'INIT_PROVIDERS') {
    const providerOptions = {
      runProviderUpdate: (provider, data) => dispatch(runProviderUpdate(provider, data)),
      runProviderRegister: (provider, data) => dispatch(runProviderRegister(provider, data)),
      initGnosis: () => dispatch(initGnosis()),
      dispatch,
    }
    if (payload && payload.provider) {
      integrations[payload.provider].initialize(providerOptions)
    } else {
      Promise.all(map(integrations, integration => integration.initialize(providerOptions)))
    }
  }

  if (type === 'PROVIDER_LOGOUT') {
    Object.keys(integrations).forEach((providerName) => {
      const integration = integrations[providerName]

      if (integration.constructor.providerName === payload) {
        integration.logout()
      }
    })
  }

  return handledAction
}

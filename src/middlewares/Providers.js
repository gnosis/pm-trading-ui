import * as walletIntegrations from 'integrations'
import { runProviderRegister, runProviderUpdate, initGnosis } from 'actions/blockchain'
import { getUportDefaultAccount } from 'selectors/blockchain'
import { map } from 'lodash'

export default store => next => (action) => {
  const handledAction = next(action)
  const { dispatch, getState } = store
  const { type } = action

  if (type === 'INIT_PROVIDERS') {
    const providerOptions = {
      runProviderUpdate: (provider, data) => dispatch(runProviderUpdate(provider, data)),
      runProviderRegister: (provider, data) => dispatch(runProviderRegister(provider, data)),
      uportDefaultAccount: getUportDefaultAccount(getState()),
      initGnosis: () => dispatch(initGnosis()),
      dispatch,
    }

    Promise.all(map(walletIntegrations, integration => integration.initialize(providerOptions)))
  }

  return handledAction
}
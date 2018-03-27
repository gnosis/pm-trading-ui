import { openModal } from 'actions/modal'

import { shouldOpenNetworkModal, isConnectedToCorrectNetwork } from 'integrations/store/selectors'

let lastConnectedToCorrectNetwork

export default store => next => (action) => {
  const handledAction = next(action)

  const { type } = action

  // only when we change again
  if (type === 'SET_ACTIVE_PROVIDER') {
    const state = store.getState()

    const connectedToCorrectNetwork = isConnectedToCorrectNetwork(state)
    const shouldOpen = shouldOpenNetworkModal(state)

    if (connectedToCorrectNetwork !== lastConnectedToCorrectNetwork && shouldOpen) {
      store.dispatch(openModal({ modalName: 'ModalSwitchNetwork' }))
    }

    lastConnectedToCorrectNetwork = connectedToCorrectNetwork
  }

  return handledAction
}

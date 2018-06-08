import { handleActions } from 'redux-actions'
import { Map, List, fromJS } from 'immutable'

import { openModal, closeModal } from 'store/actions/modal'

const reducer = handleActions(
  {
    [openModal]: (state, { payload: { modalName: currentModal, modalData = {} } }) =>
      state.withMutations((stateMap) => {
        stateMap.set('isOpen', true)
        stateMap.set('currentModal', currentModal)
        stateMap.set('modalData', fromJS(modalData))
      }),
    [closeModal]: () =>
      Map({
        isOpen: false,
        currentModal: undefined,
        transactions: List(),
      }),
  },
  Map({
    isOpen: false,
    currentModal: undefined,
    modalData: Map(),
  }),
)

export default reducer

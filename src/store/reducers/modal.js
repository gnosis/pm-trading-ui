import { handleActions } from 'redux-actions'
import { Map, List, fromJS } from 'immutable'

import { loadStorage } from 'store/middlewares/Storage'
import { openModal, closeModal } from 'store/actions/modal'

const reducer = handleActions(
  {
    [openModal]: (state, { payload: { modalName: currentModal, modalData = {} } }) => state.withMutations((stateMap) => {
      stateMap.set('isOpen', true)
      stateMap.set('currentModal', currentModal)
      stateMap.set('modalData', fromJS(modalData))
    }),
    [closeModal]: () => Map({
      isOpen: false,
      currentModal: undefined,
      transactions: List(),
    }),
    [loadStorage]: (state, { payload: { modal } }) => {
      if (modal) {
        return state.merge(fromJS(modal))
      }

      return state
    },
  },
  Map({
    isOpen: false,
    currentModal: undefined,
    modalData: Map(),
  }),
)

export default reducer

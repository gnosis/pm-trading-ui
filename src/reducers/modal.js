import { handleActions } from 'redux-actions'

import {
  openModal,
  closeModal,
} from 'actions/modal'

const reducer = handleActions({
  [openModal]: (state, action) => ({
    ...state,
    isOpen: true,
    currentModal: action.modalName,
  }),
  [closeModal]: (state, action) => ({
    ...state,
    isOpen: false,
    currentModal: undefined,
  }),
}, {
  isOpen: false,
  currentModal: undefined,
})


export default reducer

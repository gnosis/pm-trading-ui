import { handleActions } from 'redux-actions'

import {
  openModal,
  closeModal,
} from 'actions/modal'

const reducer = handleActions({
  [openModal]: (state, action) => {
    const { modalName: currentModal, ...modalData } = action.payload
    return {
      ...state,
      isOpen: true,
      currentModal,
      ...modalData,
    }
  },
  [closeModal]: () => ({
    isOpen: false,
    currentModal: undefined,
    errorMessage: '',
    status: undefined,
  }),
}, {
  isOpen: false,
  currentModal: undefined,
  transactions: [],
})


export default reducer

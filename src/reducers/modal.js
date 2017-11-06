import { handleActions } from 'redux-actions'

import {
  openModal,
  closeModal,
  updateModal,
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
  [updateModal]: (state, action) => ({
    ...state,
    ...action.payload,
  }),
}, {
  isOpen: false,
  currentModal: undefined,
  transactions: [],
  errorMessage: undefined,
  status: undefined,
})


export default reducer

import { createSelector } from 'reselect'

export const getModalData = state => state.modal.get('modalData', [])

export const getProviderModalData = createSelector(
  getModalData,
  data => data.get('provider', {}),
)

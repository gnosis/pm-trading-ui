import { Map, List } from 'immutable'
import { handleActions } from 'redux-actions'
import { registerProvider, updateProvider, setActiveProvider, setLegalDocumentsAccepted } from 'integrations/store/actions'
import { ProviderRecord } from 'integrations/store/models'
import { LOAD_LOCALSTORAGE } from '../../../store/middlewares/LocalStorageLoad'

export default handleActions(
  {
    [setActiveProvider]: (state, { payload }) => state.set('activeProvider', payload),
    [registerProvider]: (state, { payload: { provider: name, priority } }) => {
      const newProvider = { name, priority }
      return state.setIn(['providers', name], new ProviderRecord(newProvider))
    },
    [updateProvider]: (state, { payload }) => {
      const { provider: name, ...provider } = payload
      const updatedProvider = { name, loaded: true, ...provider }
      return state.mergeIn(['providers', name], updatedProvider)
    },
    [setLegalDocumentsAccepted]: (state, { payload: docs }) => state.set('documentsAccepted', List(docs)),
    [LOAD_LOCALSTORAGE]: (state, { payload: { integrations } }) => integrations,
  },
  Map({
    providers: Map(),
    activeProvider: undefined,
    documentsAccepted: List(),
  }),
)

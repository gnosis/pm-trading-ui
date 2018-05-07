import { handleActions } from 'redux-actions'
import { keys, set, get, cloneDeep } from 'lodash'

import {
  updateEntity,
  receiveEntities,
} from 'store/actions/entities'

const reducer = handleActions({
  [updateEntity]: (state, action) => ({
    ...cloneDeep(state),
    [action.payload.entityType]: {
      ...cloneDeep(state[action.payload.entityType]),
      [action.payload.data.id]: {
        ...cloneDeep(get(state, `[${action.payload.entityType}][${action.payload.data.id}]`, {})),
        ...cloneDeep(action.payload.data),
      },
    },
  }),
  [receiveEntities]: (state, action) => {
    const result = cloneDeep(state)
    keys(action.payload.entities).forEach((entityType) => {
      // preserve old entities
      const entitiesState = cloneDeep(get(state, `${entityType}`, {}))
      set(result, `${entityType}`, entitiesState)

      keys(action.payload.entities[entityType]).forEach((entityId) => {
        // preserve old entity (only update if not exists)
        const entityState = cloneDeep(get(`${entityType}.${entityId}`, {}))
        set(result, `${entityType}.${entityId}`, {
          ...entityState,
          ...cloneDeep(action.payload.entities[entityType][entityId]),
        })
      })
    })
    return result
  },
}, {})


export default reducer

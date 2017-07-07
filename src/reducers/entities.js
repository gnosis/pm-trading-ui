import { handleActions } from 'redux-actions'
import { keys, values, set, map } from 'lodash'

import {
  updateEntity,
  receiveEntities,
  removeEntity
} from 'actions/entities'

const reducer = handleActions({
  [updateEntity]: (state, action) => ({
    ...state,
    [action.payload.entityType]: {
      ...state[action.payload.entityType],
      [action.payload.data.id]: action.payload.data,
    },
  }),
  [receiveEntities]: (state, action) => {
    const result = { ...state }
    keys(action.payload.entities).forEach((entityType) => {
      keys(action.payload.entities[entityType]).forEach((entityId) => {
        set(result, `${entityType}.${entityId}`, action.payload.entities[entityType][entityId])
      })
    })
    return result
  },
  [removeEntity]: (state, action) => {
    const { [action.payload.id]: removed, ...rest } = state[action.payload.entityType]
    return {
      ...state,
      [action.payload.entityType]: { ...rest } }
  },
}, {})


export default reducer

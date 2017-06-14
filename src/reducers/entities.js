import { handleActions } from 'redux-actions'
import { keys, values, set } from 'lodash'

import { updateEntity, receiveEntities, removeEntity } from 'actions/entities'

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
      values(action.payload.entities[entityType]).forEach((entity) => {
        set(result, `${entityType}.${entity.id}`, entity)
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

import { requestFromRestAPI } from 'utils/fetch'
import addUsers from './addUsers'

export default account => dispatch =>
  requestFromRestAPI(`scoreboard/${account}`)
    .then((response) => {
      if (!response) {
        dispatch(addUsers([]))
      }

      dispatch(addUsers([response]))
    })

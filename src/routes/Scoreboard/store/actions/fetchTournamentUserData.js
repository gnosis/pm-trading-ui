import { requestFromRestAPI } from 'api/utils/fetch'
import addUsers from './addUsers'

export default account => dispatch =>
  requestFromRestAPI(`scoreboard/${account}`).then((response) => {
    if (!response || response.detail === 'Not found.') {
      dispatch(addUsers([]))
      return
    }

    dispatch(addUsers([response]))
  })

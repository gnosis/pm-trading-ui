import { requestFromRestAPI } from 'api/utils/fetch'
import addUsers from './addUsers'

export default () => dispatch =>
  requestFromRestAPI('scoreboard').then((response) => {
    if (!response) {
      dispatch(addUsers([]))
      return
    }

    dispatch(addUsers(response.results))
  })

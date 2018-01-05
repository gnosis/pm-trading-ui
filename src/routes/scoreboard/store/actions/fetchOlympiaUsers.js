import { requestFromRestAPI } from 'utils/fetch'
import addUsers from './addUsers'

export default () => dispatch =>
  requestFromRestAPI('scoreboard')
    .then((response) => {
      if (!response) {
        dispatch(addUsers([]))
      }

      dispatch(addUsers(response.results))
    })

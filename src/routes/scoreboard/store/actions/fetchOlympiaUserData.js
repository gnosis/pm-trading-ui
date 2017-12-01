import { restFetch } from 'utils/helpers'
import addUsers from './addUsers'

const API_URL = `${process.env.GNOSISDB_URL}/api`
const url = `${API_URL}/scoreboard/`

export default account => dispatch =>
  restFetch(url + account)
    .then((response) => {
      if (!response) {
        dispatch(addUsers([]))
      }

      dispatch(addUsers([response]))
    })

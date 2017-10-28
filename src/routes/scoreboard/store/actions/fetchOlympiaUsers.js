import { restFetch } from 'utils/helpers'
import addUsers from './addUsers'

const url = 'https://gnosisdb-olympia.gnosis.pm/api/scoreboard/'

export default (params) => (dispatch) =>
    restFetch(url)
        .then((response) => {
            if (!response) {
                return []
            }

            dispatch(addUsers(response.results));
        })

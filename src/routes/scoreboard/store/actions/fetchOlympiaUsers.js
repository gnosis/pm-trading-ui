import { restFetch } from 'utils/helpers'
import addUsers from './addUsers'

const url = 'https://gnosisdb-olympia.gnosis.pm/api/scoreboard/'

export default () => dispatch =>
    restFetch(url)
        .then((response) => {
            if (!response) {
                dispatch(addUsers([]))
            }

            dispatch(addUsers(response.results))
        })

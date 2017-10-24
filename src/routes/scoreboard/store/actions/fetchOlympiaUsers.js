import { usersData } from 'stories/knobs/scoreboardUsers'
import addUsers from './addUsers'

const url = ''
const dummyData = usersData
const composeTournament = new Promise((resolve, reject) => resolve(dummyData))

export default (params) => (dispatch) =>
    //restFetch(url)
    composeTournament
        .then((response) => {
            if (!response) {
                return []
            }
            dispatch(addUsers(response));
        })

/* globals fetch */
import qs from 'querystring'

const API_URL = `${process.env.GNOSISDB_URL}/api`

export const requestFromRestAPI = async (endpoint, queryparams) => {
  const url = `${API_URL}/${endpoint}?${qs.stringify(queryparams)}`
  const response = await fetch(url)

  if (response.status > 400) {
    throw new Error('GnosisDB: Couldn\'t fetch (invalid statuscode)')
  }

  try {
    return response.json()
  } catch (e) {
    throw new Error('GnosisDB: Couldn\'t fetch (format error)')
  }
}

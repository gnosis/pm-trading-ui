/* globals fetch */
import qs from 'querystring'
import { getConfiguration } from 'utils/features'

const config = getConfiguration()

const API_URL = `${config.gnosisdb.protocol}://${config.gnosisdb.host}/api`

export const requestFromRestAPI = async (endpoint, queryparams) => {
  const url = `${API_URL}/${endpoint}?${qs.stringify(queryparams)}`

  console.log(`url = ${url}`)
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

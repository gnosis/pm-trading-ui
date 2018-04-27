/* globals fetch */
import qs from 'querystring'
import { getConfiguration } from 'utils/features'

const config = getConfiguration()

const API_URL = `${config.gnosisdb.protocol}://${config.gnosisdb.host}/api`

export const requestFromRestAPI = async (endpoint, queryparams) => {
  const url = `${API_URL}/${endpoint}?${qs.stringify(queryparams)}`

  let response

  try {
    response = await fetch(url)
    return response.json()
  } catch (e) {
    console.error(`GnosisDB: Couldn't fetch ${e}`)
  }
}

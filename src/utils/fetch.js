/* globals fetch */
import qs from 'querystring'

const API_URL = `${process.env.GNOSISDB_URL}/api`

export const requestFromRestAPI = async (endpoint, queryparams) => {
  const url = `${API_URL}/${endpoint}?${qs.stringify(queryparams)}`
  const response = await fetch(url)

  if (response.status > 400) {
    console.warn(`Couldn't fetch ${url}: ${response.status}: ${response.statusText}`)
    throw new Error('GnosisDB: Couldn\'t fetch (invalid statuscode)')
  }

  let json
  try {
    json = response.json()
  } catch (e) {
    console.warn(`Couldn't format response to JSON: ${url}: ${response.body}`)
    throw new Error('GnosisDB: Couldn\'t fetch (format error)')
  }

  return json
}

export const requestFromRestAPIPage = async (endpoint, queryparams = {}, page = 0, pageSize = 100) =>
  requestFromRestAPI(endpoint, {
    ...queryparams,
    limit: pageSize,
    size: pageSize,
    offset: page * pageSize,
  })

export const requestFromRestAPIAllPages = async (endpoint, queryparams, pageSize, limit = 100000) => {
  let page = 0
  const request = requestFromRestAPIPage(endpoint, queryparams, page, pageSize)
  const payload = await request

  const allPageRequests = [request]

  let processedCount = payload.results.length

  while (processedCount < payload.count && processedCount < limit) {
    page += 1
    processedCount += payload.results.length
    allPageRequests.push(requestFromRestAPIPage(endpoint, queryparams, page, pageSize))
  }

  const results = []
  const pageRequests = await Promise.all(allPageRequests)
  pageRequests.forEach((pageRequest) => {
    results.push(...pageRequest.results)
  })

  return {
    results,
    count: results.length,
  }
}

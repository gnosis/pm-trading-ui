import moment from 'moment'
import { flatten } from 'lodash'
import { hexWithoutPrefix } from 'utils/helpers'
import { requestFromRestAPI } from 'api/utils/fetch'
import { processTradesResponse } from 'store/actions/trades'

const TOTAL_TRADES_LIMIT = 500

const getRequestParameters = (from, to, order = 'ASC', limit = 200, offset = 0) => ({
  creation_date_time_0: moment.utc(from).format('YYYY-MM-DD hh:mm:ss'),
  creation_date_time_1: moment.utc(to).format('YYYY-MM-DD hh:mm:ss'),
  ordering: order === 'ASC' ? 'creation_date_order' : '-creation_date_order',
  limit,
  offset,
})

const fetchAllTrades = (marketAddress, limit, requestParameters, requestsArray = []) => {
  for (let tradesCount = 0; tradesCount < limit; tradesCount += 200) {
    requestsArray.push(
      requestFromRestAPI(`markets/${marketAddress}/trades/`, { ...requestParameters, offset: tradesCount }),
    )
  }

  return requestsArray
}

export default ({ creation, resolution, address }) => async (dispatch) => {
  if (!address || !creation || !resolution) {
    return
  }

  const normalizedMarket = hexWithoutPrefix(address)

  const { count } = await requestFromRestAPI(
    `markets/${normalizedMarket}/trades/`,
    getRequestParameters(creation, resolution, 'ASC', 1),
  )

  const requests = []
  // fetch all trades if they're in limit
  if (count <= TOTAL_TRADES_LIMIT) {
    await fetchAllTrades(normalizedMarket, count, getRequestParameters(creation, resolution, 'ASC', 200), requests)
  } else {
    const resolutionDatePassed = moment.utc().isBefore(moment.utc(resolution))
    const diff = moment.utc(resolutionDatePassed ? moment.utc() : resolution).diff(moment.utc(creation), 'days')
    const dailyLimit = TOTAL_TRADES_LIMIT / diff

    // fetch latest *dailyLimit* trades of an each day the market has been running
    for (let dayCount = 0; dayCount <= diff; dayCount += 1) {
      const startDate = moment.utc(creation).add(dayCount, 'days')
      const endDate = moment.utc(creation).add(dayCount + 1, 'days')
      fetchAllTrades(
        normalizedMarket,
        dailyLimit,
        getRequestParameters(startDate, endDate, 'DESC', dailyLimit),
        requests,
      )
    }
  }

  const trades = await Promise.all(requests)

  const formattedResponse = { results: flatten(trades.map(({ results }) => results)) }

  processTradesResponse(formattedResponse, dispatch)
}

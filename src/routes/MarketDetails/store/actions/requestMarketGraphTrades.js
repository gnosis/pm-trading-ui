import moment from 'moment'
import { flatten } from 'lodash'
import { hexWithoutPrefix } from 'utils/helpers'
import { requestFromRestAPI } from 'api/utils/fetch'
import { processTradesResponse } from 'store/actions/trades'

const TOTAL_TRADES_LIMIT = 2000

const getRequestParameters = (from, to, order = 'ASC', limit = 200, offset = 0) => ({
  creation_date_time_0: moment.utc(from).format('YYYY-MM-DD hh:mm:ss'),
  creation_date_time_1: moment.utc(to).format('YYYY-MM-DD hh:mm:ss'),
  ordering: order === 'ASC' ? 'creation_date_order' : '-creation_date_order',
  limit,
  offset,
})

export default ({ creation, resolution, address }) => async (dispatch) => {
  if (!address || !creation || !resolution) {
    return
  }

  const normalizedMarket = hexWithoutPrefix(address)
  const trades = []

  const { count } = await requestFromRestAPI(
    `markets/${normalizedMarket}/trades/`,
    getRequestParameters(creation, resolution, 'ASC', 1),
  )

  // fetch all trades if they're in limit
  if (count <= TOTAL_TRADES_LIMIT) {
    for (let i = 0; i < count; i += 200) {
      trades.push(
        requestFromRestAPI(
          `markets/${normalizedMarket}/trades/`,
          getRequestParameters(creation, resolution, 'ASC', 200, i),
        ),
      )
    }
  } else {
    const resolutionDatePassed = moment.utc().isBefore(moment.utc(resolution))
    const diff = moment
      .utc(resolutionDatePassed ? moment.utc() : resolution)
      .diff(moment.utc(creation), 'days')
    const dailyLimit = 2000 / diff

    // fetch latest *dailyLimit* trades of an each day the market has been running
    for (let i = 0; i <= diff; i += 1) {
      const requestParameters = {
        creation_date_time_0: moment
          .utc(creation)
          .add(i, 'days')
          .format('YYYY-MM-DD hh:mm:ss'),
        creation_date_time_1: moment
          .utc(creation)
          .add(i + 1, 'days')
          .format('YYYY-MM-DD hh:mm:ss'),
        ordering: '-creation_date_order',
        limit: 200,
      }

      trades.push(requestFromRestAPI(`markets/${normalizedMarket}/trades/`, requestParameters))
    }
  }

  const responses = await Promise.all(trades)

  const formattedResponse = { results: flatten(responses.map(({ results }) => results)) }

  processTradesResponse(formattedResponse, dispatch)
}

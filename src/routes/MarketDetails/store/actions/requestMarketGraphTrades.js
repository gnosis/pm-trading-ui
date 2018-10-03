import moment from 'moment'
import { flatten } from 'lodash'
import { hexWithoutPrefix } from 'utils/helpers'
import { requestFromRestAPI } from 'api/utils/fetch'
import { processTradesResponse } from 'store/actions/trades'

export default ({ creation, resolution, address }) => async (dispatch) => {
  if (!address || !creation || !resolution) {
    return
  }

  const normalizedMarket = hexWithoutPrefix(address)
  const diff = moment(resolution).diff(moment(creation), 'days')
  const trades = []

  // fetch latest 15 trades of an each day the market has been running
  for (let i = 0; i <= diff; i += 1) {
    const requestParameters = {
      creation_date_time_0: moment(creation)
        .add(i, 'days')
        .format('YYYY-MM-DD hh:mm:ss'),
      creation_date_time_1: moment(creation)
        .add(i + 1, 'days')
        .format('YYYY-MM-DD hh:mm:ss'),
      ordering: '-creation_date_order',
      limit: 15,
    }

    trades.push(requestFromRestAPI(`markets/${normalizedMarket}/trades/`, requestParameters))
  }

  const responses = await Promise.all(trades)

  const formattedResponse = { results: flatten(responses.map(({ results }) => results)) }

  processTradesResponse(formattedResponse, dispatch)
}

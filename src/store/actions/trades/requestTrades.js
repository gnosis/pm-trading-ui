import moment from 'moment'
import sha1 from 'sha1'

import { OUTCOME_TYPES } from 'utils/constants'
import { requestFromRestAPI } from 'api/utils/fetch'
import { hexWithoutPrefix } from 'utils/helpers'

import TradeRecord from 'store/models/trade'
import { addTrade } from 'store/actions/trades'

const OUTCOMES_SCALAR = ['Short', 'Long']

const extractTrade = (payload) => {
  const {
    outcomeToken: selectedOutcomeToken,
    outcomeTokenCount,
    collateralToken: collateralTokenAddress,
    cost,
    owner,
    profit: rawProfit,
    orderType,
    marginalPrices,
    date,
    eventDescription: { title: marketTitle, outcomes: marketOutcomeLabels } = {},
  } = payload

  const profit = rawProfit === 'None' ? '0' : rawProfit
  const price = orderType === 'BUY' ? cost : profit
  const id = sha1(`${owner}-${orderType}-${price}-${date}-${selectedOutcomeToken.index}-${outcomeTokenCount}`)
  const marketType = typeof marketOutcomeLabels !== 'undefined' ? OUTCOME_TYPES.CATEGORICAL : OUTCOME_TYPES.SCALAR
  const outcomeToken = {
    index: selectedOutcomeToken.index,
    name: marketOutcomeLabels?.[selectedOutcomeToken.index] || OUTCOMES_SCALAR[selectedOutcomeToken.index],
    outcomeTokenCount,
  }

  const record = new TradeRecord({
    id,
    date: moment.utc(date),
    collateralTokenAddress,
    eventAddress: selectedOutcomeToken.event,
    outcomeToken,
    outcomeTokenCount,
    price,
    marketTitle,
    marketType,
    owner,
    orderType,
    marginalPrices,
  })

  return record
}

export const processTradesResponse = (response, dispatch) => {
  if (response && response.results.length) {
    const tradeRecords = response.results.map(extractTrade)
    dispatch(addTrade(tradeRecords))
  }
}

export default account => async (dispatch) => {
  const normalizedAccount = hexWithoutPrefix(account)
  const response = await requestFromRestAPI(`account/${normalizedAccount}/trades`)

  processTradesResponse(response, dispatch)
}

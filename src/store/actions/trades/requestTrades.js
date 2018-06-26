import moment from 'moment'
import { List } from 'immutable'
import sha1 from 'sha1'

import { OUTCOME_TYPES } from 'utils/constants'
import { requestFromRestAPI } from 'api/utils/fetch'
import { hexWithoutPrefix } from 'utils/helpers'

import TradeRecord from 'store/models/trade'
import { addTrade } from 'store/actions/trades'
import { OutcomeRecord } from 'store/models/market'

const OUTCOMES_SCALAR = ['Short', 'Long']

const buildOutcomesFrom = (outcomeTokensSold, selectedOutcomeToken, marketOutcomeLabels) => {
  // no value for eventDescription.outcomes means we have a scalar market
  const outcomeLabels = marketOutcomeLabels || OUTCOMES_SCALAR

  const outcomes = outcomeLabels.map(
    (label, index) => new OutcomeRecord({
      index,
      name: label,
      outcomeTokensSold,
    }),
  )

  return List(outcomes)
}

const extractTrade = (payload) => {
  const {
    outcomeToken: selectedOutcomeToken,
    outcomeTokenCount: selectedOutcomeTokenCount,
    collateralToken: collateralTokenAddress,
    cost,
    owner,
    profit: rawProfit,
    orderType,
    date,
    eventDescription: { title: marketTitle, outcomes: marketOutcomeLabels } = {},
  } = payload

  const profit = rawProfit === 'None' ? '0' : rawProfit
  const price = orderType === 'BUY' ? cost : profit
  const id = sha1(`${owner}-${orderType}-${price}-${date}-${selectedOutcomeToken.index}-${selectedOutcomeTokenCount}`)
  const marketType = typeof marketOutcomeLabels !== 'undefined' ? OUTCOME_TYPES.CATEGORICAL : OUTCOME_TYPES.SCALAR

  const outcomes = buildOutcomesFrom(selectedOutcomeTokenCount, selectedOutcomeToken, marketOutcomeLabels)

  const record = new TradeRecord({
    id,
    date: moment.utc(date),
    collateralTokenAddress,
    eventAddress: selectedOutcomeToken.event,
    outcomeToken: outcomes.get(selectedOutcomeToken.index),
    price,
    marketTitle,
    marketType,
    marketOutcomes: outcomes,
    orderType,
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

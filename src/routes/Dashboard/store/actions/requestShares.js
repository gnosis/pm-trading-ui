import moment from 'moment'
import { List } from 'immutable'
import sha1 from 'sha1'

import { requestFromRestAPI } from 'api/utils/fetch'
import { hexWithoutPrefix } from 'utils/helpers'
import { OutcomeRecord } from 'store/models/market'
import ShareRecord from '../models/share'
import { addShare } from '../actions'

const buildOutcomesFrom = (marginalPrice, selectedOutcomeToken, marketOutcomeLabels) => {
  const outcomes = marketOutcomeLabels.map((label, index) =>
    new OutcomeRecord({
      name: label,
      marginalPrice: selectedOutcomeToken.index === index ? marginalPrice : undefined,
      outcomeTokensSold: undefined,
    }))

  return List(outcomes)
}

const extractShare = (payload) => {
  const {
    outcomeToken: selectedOutcomeToken,
    owner,
    balance,
    marginalPrice,
    eventDescription: {
      title: marketTitle,
      description: marketDescription,
      resolutionDate: marketResolution,
      outcomes: marketOutcomeLabels,
    },
  } = payload

  const outcomes = buildOutcomesFrom(marginalPrice, selectedOutcomeToken, marketOutcomeLabels)
  const id = sha1(`${owner}-${selectedOutcomeToken.event}-${selectedOutcomeToken.index}`)

  const record = new ShareRecord({
    id,
    owner,
    balance,
    marketTitle,
    marketDescription,
    marketResolution: moment.utc(marketResolution),
    marketOutcomes: outcomes,
    marginalPrice,
    outcomeToken: outcomes[selectedOutcomeToken.index],
  })

  return record
}

const processSharesResponse = (dispatch, response) => {
  if (response && response.results.length) {
    const shareRecords = response.results.map(extractShare)

    return dispatch(addShare(shareRecords))
  }
}

export default account => async (dispatch) => {
  const normalizedAccount = hexWithoutPrefix(account)
  const response = await requestFromRestAPI(`account/${normalizedAccount}/shares`)

  return dispatch(processSharesResponse(response))
}

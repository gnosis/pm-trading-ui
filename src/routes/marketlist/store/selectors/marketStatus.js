import moment from 'moment'
import { MARKET_STAGES } from 'store/models'

export const isMarketClosed = (stage, resolutionDate, resolved) => {
  const stageClosed = stage !== MARKET_STAGES.MARKET_FUNDED
  const marketExpired = moment.utc(resolutionDate).isBefore(moment().utc())
  const marketResolved = resolved === true

  const marketClosed = stageClosed || marketExpired || marketResolved
  return marketClosed
}

export const isMarketEndingSoon = (resolutionDate) => {
  const threeDays = moment().add(3, 'days').utc()

  return moment.utc(resolutionDate).isBefore(threeDays)
}

export const isNewMarket = (creation) => {
  const threeDaysAgo = moment().subtract(3, 'days').utc()

  return threeDaysAgo.isBefore(creation)
}


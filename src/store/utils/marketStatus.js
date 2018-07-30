import moment from 'moment'
import { MARKET_STAGES } from 'store/models'

export const isMarketClosed = ({ stage, resolution }) => {
  const stageClosed = stage !== MARKET_STAGES.MARKET_FUNDED
  const marketExpired = moment.utc(resolution).isBefore(moment.utc())

  const marketClosed = stageClosed || marketExpired
  return marketClosed
}

export const isMarketEndingSoon = (resolutionDate) => {
  const threeDays = moment.utc().add(3, 'days')
  return moment.utc(resolutionDate).isSameOrBefore(threeDays)
}

export const isNewMarket = (creation) => {
  const threeDaysAgo = moment.utc().subtract(3, 'days')

  return threeDaysAgo.isBefore(creation)
}

export const isMarketResolved = ({ resolved }) => resolved

export const isMarketClosedOrResolved = market => isMarketClosed(market) || isMarketResolved(market)

export const isMarketFunded = stage => stage > MARKET_STAGES.MARKET_CREATED

import PropTypes from 'prop-types'
import { ETHEREUM_NETWORK, WALLET_PROVIDER } from 'integrations/constants'
import { TRANSACTION_COMPLETE_STATUS } from './constants'

export const eventDescriptionShape = PropTypes.shape({
  description: PropTypes.string,
  ipfsHash: PropTypes.string,
  outcomes: PropTypes.arrayOf(PropTypes.string),
  resolutionDate: PropTypes.string,
  title: PropTypes.string,
  decimals: PropTypes.number,
  unit: PropTypes.string,
})

export const outcomeTokenShape = PropTypes.shape({
  address: PropTypes.string,
  event: PropTypes.string,
  index: PropTypes.number,
  totalSupply: PropTypes.string,
})

export const providerPropType = PropTypes.shape({
  name: PropTypes.oneOf(Object.values(WALLET_PROVIDER)),
  loaded: PropTypes.bool,
  available: PropTypes.bool,
  priority: PropTypes.number,
  network: PropTypes.oneOf(Object.values(ETHEREUM_NETWORK)),
  balance: PropTypes.string,
})

export const eventShape = PropTypes.shape({
  event: PropTypes.string,
  label: PropTypes.string,
  status: PropTypes.string,
  type: PropTypes.string,
  lowerBound: PropTypes.string,
  upperBound: PropTypes.string,
})

export const marketShape = PropTypes.shape({
  event: eventShape,
  eventDescription: eventDescriptionShape,
  oracle: PropTypes.object,
  netOutcomeTokensSold: PropTypes.arrayOf(PropTypes.string),
  address: PropTypes.string,
})

export const marketShareShape = PropTypes.shape({
  balance: PropTypes.string,
  event: PropTypes.oneOfType([PropTypes.string, eventShape]),
  eventDescription: eventDescriptionShape,
  id: PropTypes.string,
  marginalPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  outcomeToken: outcomeTokenShape,
  owner: PropTypes.string,
})

export const marketTradeShape = PropTypes.shape({
  id: PropTypes.string,
  event: PropTypes.oneOfType([PropTypes.string, eventShape]),
  owner: PropTypes.string,
})

export const transactionShape = PropTypes.shape({
  id: PropTypes.string,
  label: PropTypes.string,
  events: PropTypes.arrayOf(eventShape),
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  completed: PropTypes.bool,
  completionStatus: PropTypes.oneOf(Object.values(TRANSACTION_COMPLETE_STATUS)),
})

export const gasCostsShape = PropTypes.shape({
  redeemWinnings: PropTypes.number,
  market: PropTypes.number,
  buyShares: PropTypes.number,
  sellShares: PropTypes.number,
  resolveOracle: PropTypes.number,
  withdrawFees: PropTypes.number,
  categoricalEvent: PropTypes.number,
  scalarEvent: PropTypes.number,
  centralizedOracle: PropTypes.number,
  funding: PropTypes.number,
})

export const ReactRouterMatchShape = PropTypes.shape({
  isExact: PropTypes.bool,
  path: PropTypes.string,
  url: PropTypes.string,
  params: PropTypes.object,
})

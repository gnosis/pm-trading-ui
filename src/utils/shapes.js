import PropTypes from 'prop-types'

export const eventDescriptionShape = PropTypes.shape({
  description: PropTypes.string,
  ipfsHash: PropTypes.string,
  outcomes: PropTypes.arrayOf(PropTypes.string),
  resolutionDate: PropTypes.string,
  title: PropTypes.string,
})

export const outcomeTokenShape = PropTypes.shape({
  address: PropTypes.string,
  event: PropTypes.string,
  index: PropTypes.number,
  totalSupply: PropTypes.string,
})

export const marketShareShape = PropTypes.shape({
  balance: PropTypes.string,
  event: PropTypes.string,
  eventDescription: eventDescriptionShape,
  id: PropTypes.string,
  marginalPrice: PropTypes.number,
  outcomeToken: outcomeTokenShape,
  owner: PropTypes.string,
})

export const marketShape = PropTypes.shape({
  event: PropTypes.object,
  eventDescription: eventDescriptionShape,
  oracle: PropTypes.object,
  netOutcomeTokensSold: PropTypes.arrayOf(PropTypes.string),
  address: PropTypes.string,
})

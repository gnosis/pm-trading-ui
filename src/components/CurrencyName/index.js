import React from 'react'
import { connect } from 'react-redux'
import { getTokenSymbol } from 'selectors/blockchain'
import PropTypes from 'prop-types'

// Current mapping does not contain any logic
export const tokenToText = () => 'ETH'

const CurrencyName = ({ tokenAddress, tokenSymbol }) => {
  if (tokenAddress) {
    return <span>{tokenSymbol}</span>
  }

  return <span>Unknown</span>
}

const mapStateToProps = (state, ownProps) => ({
  tokenSymbol: getTokenSymbol(state, ownProps.tokenAddress),
})

CurrencyName.propTypes = {
  tokenAddress: PropTypes.string.isRequired,
  tokenSymbol: PropTypes.string,
}

CurrencyName.defaultProps = {
  tokenSymbol: undefined,
}

export default connect(mapStateToProps, null)(CurrencyName)

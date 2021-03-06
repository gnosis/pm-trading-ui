import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getTokenSymbol } from 'store/selectors/blockchain'
import { requestTokenSymbol } from 'store/actions/blockchain'
import PropTypes from 'prop-types'

class CurrencyName extends Component {
  componentDidMount() {
    const { tokenSymbol, tokenAddress, requestTokenSymbol: fetchTokenSymbol } = this.props
    const unknownTokenSymbol = !tokenSymbol && tokenAddress
    if (unknownTokenSymbol) {
      fetchTokenSymbol()
    }
  }

  render() {
    const { tokenAddress, tokenSymbol, className } = this.props
    if (tokenAddress) {
      return <span className={className}>{tokenSymbol}</span>
    }

    return <span className={className}>Unknown</span>
  }
}

const mapStateToProps = (state, ownProps) => ({
  tokenSymbol: getTokenSymbol(state, ownProps.tokenAddress),
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  requestTokenSymbol: () => dispatch(requestTokenSymbol(ownProps.tokenAddress)),
})

CurrencyName.propTypes = {
  tokenAddress: PropTypes.string.isRequired,
  tokenSymbol: PropTypes.string,
  requestTokenSymbol: PropTypes.func.isRequired,
  className: PropTypes.string,
}

CurrencyName.defaultProps = {
  tokenSymbol: undefined,
  className: '',
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CurrencyName)

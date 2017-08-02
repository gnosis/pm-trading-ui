import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'

import { getContractInfo } from 'selectors/blockchain'

const ContractName = ({ contract, contractAddress }) => {
  if (contract) {
    return <span>{contract.name}</span>
  }

  return <span>{contractAddress}</span>
}

const mapStateToProps = (state, ownProps) => ({
  contract: getContractInfo(state)(ownProps.contractId),
})

export default connect(mapStateToProps)(ContractName)

import React, { Component } from 'react'

import { Metamask } from 'integrations'

const withWalletIntegration = () => {
  const integrationPromise = new Promise((resolve, reject) => {
    /* eslint-disable no-console */
    /* eslint-disable no-undef */
    window.addEventListener('load', () => {
      if (typeof window.web3 !== 'undefined') {
        web3 = new Web3(window.web3.currentProvider)
        resolve(new Metamask(web3))
      } else {
        reject()
      }
    })
    /* eslint-enable no-console */
    /* eslint-enable no-undef */
  })

  return WrappedComponent => class WalletIntegration extends Component {
    constructor(props) {
      super(props)

      this.state = {
        wallet: undefined,
      }

      integrationPromise
        .then((integration) => {
          this.setState({ wallet: integration })
        })
    }

    render() {
      return this.state.wallet !== undefined ? (
        <WrappedComponent {...this.props} {...this.state} />
      ) : null
    }
  }
}

export default withWalletIntegration()

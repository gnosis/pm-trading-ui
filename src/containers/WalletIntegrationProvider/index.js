import { Component } from 'react'

class WalletIntegrationProvider extends Component {
  constructor(props) {
    super(props)

    const { integrations, store } = props
    Object.keys(integrations)
      .forEach(integrationName => integrations[integrationName].initialize(store))
  }

  render() {
    const { children } = this.props

    return children
  }
}

export default WalletIntegrationProvider
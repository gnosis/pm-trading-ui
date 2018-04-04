import * as React from 'react'
import PropTypes from 'prop-types'
import Layout from './Layout'

class Metrics extends React.PureComponent {
  static propTypes = {
    tokens: PropTypes.string,
    predictedProfit: PropTypes.string,
    tokenSymbol: PropTypes.string,
  }

  static defaultProps = {
    tokens: '0',
    predictedProfit: '0',
    tokenSymbol: '',
  }

  render() {
    const { tokens, predictedProfit, tokenSymbol } = this.props
    return <Layout tokens={tokens} predictedProfit={predictedProfit} tokenSymbol={tokenSymbol} />
  }
}

export default Metrics

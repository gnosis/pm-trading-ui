import * as React from 'react'
import PropTypes from 'prop-types'
import Layout from './Layout'

class Metrics extends React.PureComponent {
  static propTypes = {
    predictedProfit: PropTypes.string,
    tokens: PropTypes.string,
    tokenSymbol: PropTypes.string,
    tokenIcon: PropTypes.string,
  }

  static defaultProps = {
    predictedProfit: '0',
    tokens: '0',
    tokenSymbol: '',
    tokenIcon: '',
  }

  render() {
    const {
      predictedProfit, tokens, tokenSymbol, tokenIcon,
    } = this.props
    return <Layout tokens={tokens} predictedProfit={predictedProfit} tokenSymbol={tokenSymbol} tokenIcon={tokenIcon} />
  }
}

export default Metrics

import * as React from 'react'
import PropTypes from 'prop-types'
import Layout from './Layout'

class Metrics extends React.PureComponent {
  static propTypes = {
    tokens: PropTypes.string,
    predictedProfit: PropTypes.string,
  }

  static defaultProps = {
    tokens: '0',
    predictedProfit: '0',
  }

  render() {
    const { tokens, predictedProfit } = this.props
    console.log(tokens)
    return <Layout tokens={tokens} predictedProfit={predictedProfit} />
  }
}

export default Metrics

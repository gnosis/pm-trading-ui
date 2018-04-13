import * as React from 'react'
import PropTypes from 'prop-types'
import Layout from './Layout'

class Metrics extends React.PureComponent {
  static propTypes = {
    predictedProfit: PropTypes.string,
    tokens: PropTypes.string,
    tokenSymbol: PropTypes.string,
    tokenIcon: PropTypes.string,
    rank: PropTypes.string,
    badge: PropTypes.string,
  }

  static defaultProps = {
    predictedProfit: '0',
    tokens: '0',
    tokenSymbol: '',
    tokenIcon: '',
    rank: '',
    badge: '',
  }

  render() {
    const {
      predictedProfit, tokens, tokenSymbol, tokenIcon, rank, badge,
    } = this.props
    return (
      <Layout
        tokens={tokens}
        predictedProfit={predictedProfit}
        tokenSymbol={tokenSymbol}
        tokenIcon={tokenIcon}
        rank={rank}
        badge={badge}
      />
    )
  }
}

export default Metrics

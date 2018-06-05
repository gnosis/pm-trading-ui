import * as React from 'react'
import PropTypes from 'prop-types'
import { badgeOf } from 'routes/Scoreboard/components/Table/ScoreTable/table'
import Layout from './Layout'

class Metrics extends React.PureComponent {
  static propTypes = {
    predictedProfit: PropTypes.string,
    tokens: PropTypes.string,
    tokenSymbol: PropTypes.string,
    tokenIcon: PropTypes.string,
    rank: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    predictionsAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }

  static defaultProps = {
    predictedProfit: '0',
    tokens: '0',
    tokenSymbol: '',
    tokenIcon: '',
    rank: '',
    predictionsAmount: 0,
  }

  render() {
    const {
      predictedProfit, tokens, tokenSymbol, tokenIcon, rank, predictionsAmount,
    } = this.props

    const badge = badgeOf(predictionsAmount) || {}

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

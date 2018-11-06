import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { OUTCOME_TYPES } from 'utils/constants'
import CategoricalGraph from './CategoricalGraph'
import ScalarGraph from './ScalarGraph'

const MARKET_GRAPH_FETCH_INTERVAL = 25000

class MarketGraph extends Component {
  componentDidMount() {
    const { fetchMarketTrades, market } = this.props

    fetchMarketTrades(market)
    this.tradesFetchInterval = setInterval(() => fetchMarketTrades(market), MARKET_GRAPH_FETCH_INTERVAL)
  }

  componentWillUnmount() {
    clearInterval(this.tradesFetchInterval)
  }

  render() {
    const { data, market } = this.props
    if (market.type === OUTCOME_TYPES.CATEGORICAL) {
      return <CategoricalGraph data={data} />
    }
    if (market.type === OUTCOME_TYPES.SCALAR) {
      return <ScalarGraph data={data} bounds={market.bounds} />
    }

    return null
  }
}

MarketGraph.propTypes = {
  fetchMarketTrades: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  market: ImmutablePropTypes.record.isRequired,
}

MarketGraph.defaultProps = {
  data: [],
}

export default MarketGraph

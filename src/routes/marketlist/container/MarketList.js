import { List } from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import actions from './actions'
import selector from './selector'

class MarketList extends React.Component {
  componentDidMount() {
    this.props.fetchMarkets()
  }

  render() {
    const {
      markets, openMarkets, newMarkets, endingSoonMarkets,
    } = this.props

    return (<Layout
      markets={markets}
      openMarkets={openMarkets}
      newMarkets={newMarkets}
      endingSoonMarkets={endingSoonMarkets}
    />)
  }
}

MarketList.propTypes = {
  markets: PropTypes.instanceOf(List),
  openMarkets: PropTypes.number.isRequired,
  newMarkets: PropTypes.number.isRequired,
  endingSoonMarkets: PropTypes.number.isRequired,
  fetchMarkets: PropTypes.func.isRequired,
}

MarketList.defaultProps = {
  markets: List([]),
}

export default connect(selector, actions)(MarketList)

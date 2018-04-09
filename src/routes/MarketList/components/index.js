import React, { Component } from 'react'
import { List } from 'immutable'
import PropTypes from 'prop-types'
import MarketOverview from './MarketOverview.jsx'
import Markets from './Markets.jsx'
import Filter from './Filter/index.jsx'
import MarketStats from './MarketStats.jsx'
import MarketsTitle from './MarketsTitle.jsx'
import NoMarkets from './NoMarkets.jsx'

// eslint-disable-next-line
class MarketList extends Component {
  componentDidMount() {
    this.props.fetchMarkets()
  }

  render() {
    const {
      markets, openMarkets, newMarkets, endingSoonMarkets, userAccount,
    } = this.props
    return (
      <div>
        <MarketsTitle />
        <MarketStats
          open={openMarkets}
          newMarkets={newMarkets}
          endingSoon={endingSoonMarkets}
        />
        <MarketOverview>
          <div className="col-md-9">
            { markets ? <Markets markets={markets} userAccount={userAccount} /> : <NoMarkets /> }
          </div>
          <div className="col-md-3">
            <Filter userAccount={userAccount} />
          </div>
        </MarketOverview>
      </div>
    )
  }
}


MarketList.propTypes = {
  fetchMarkets: PropTypes.func.isRequired,
  markets: PropTypes.instanceOf(List),
  userAccount: PropTypes.string,
  openMarkets: PropTypes.number.isRequired,
  newMarkets: PropTypes.number.isRequired,
  endingSoonMarkets: PropTypes.number.isRequired,
}

MarketList.defaultProps = {
  markets: List([]),
  userAccount: undefined,
}

export default MarketList

import React, { Component } from 'react'
import { List } from 'immutable'
import { compose, withProps } from 'recompose'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import MarketOverview from '../MarketOverview'
import Markets from '../Markets'
import Filter from '../Filter/index'
import MarketStats from '../MarketStats'
import MarketsTitle from '../MarketsTitle'
import NoMarkets from '../NoMarkets'

// eslint-disable-next-line
class MarketList extends Component {
  componentDidMount() {
    this.props.fetchMarkets()
  }

  render() {
    const {
      markets, openMarkets, newMarkets, endingSoonMarkets, userAccount, viewMarket,
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
          <div className="col-md-3 col-md-push-9">
            <Filter userAccount={userAccount} />
          </div>
          <div className="col-md-9 col-md-pull-3">
            { markets ? <Markets markets={markets} userAccount={userAccount} viewMarket={viewMarket} /> : <NoMarkets /> }
          </div>
        </MarketOverview>
      </div>
    )
  }
}


MarketList.propTypes = {
  viewMarket: PropTypes.func.isRequired,
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

const enhancer = compose(
  withRouter,
  withProps(({ history }) => ({
    viewMarket: address => history.push(`/markets/${address}`),
  })),
)

export default enhancer(MarketList)

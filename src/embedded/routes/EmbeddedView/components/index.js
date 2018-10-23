import React from 'react'
import PropTypes from 'prop-types'
import IndefiniteSpinner from 'components/Spinner/Indefinite'

import Market from 'routes/MarketList/components/Markets/Market'
import NoMatch from './NoMatch'


const EmbeddedView = ({ requestStatus, market }) => {
  if (requestStatus === 'SUCCESS') {
    const marketUrl = `${window.location.origin}/market/${market.address}`
    return (
      <Market
        market={market}
        address={market.address}
        resolved={market.resolved}
        closed={false}
        isOwner={false}
        title={market.title}
        resolution={market.resolution}
        collateralToken={market.collateralToken}
        viewMarket={() => window.open(marketUrl)}
      />
    )
  }
  if (requestStatus === 'ERROR') {
    return <NoMatch />
  }

  return <IndefiniteSpinner width={50} height={50} />
}

EmbeddedView.propTypes = {
  requestStatus: PropTypes.string.isRequired,
  market: PropTypes.shape({}).isRequired,
}

export default EmbeddedView

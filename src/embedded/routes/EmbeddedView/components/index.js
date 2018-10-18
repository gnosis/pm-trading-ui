import React from 'react'
import IndefiniteSpinner from 'components/Spinner/Indefinite'

import Market from 'routes/MarketList/components/Markets/Market'
import NoMatch from './NoMatch'


const EmbeddedView = ({ requestStatus, market }) => {
  console.log(requestStatus)
  if (requestStatus === 'SUCCESS') {
    console.log(market)
    return (
      <Market
        market={market}
        address={market.address}
        resolved={market.resolved}
        closed={false}
        isOwner={false}
        title={market.title}
        resolution={market.resolution}
        volume={market.volume}
        collateralToken={market.collateralToken}
        viewMarket={() => window.open('https://google.com')}
      />
    )
  }
  if (requestStatus === 'ERROR') {
    return <NoMatch />
  }

  return <IndefiniteSpinner width={50} height={50} />
}

export default EmbeddedView

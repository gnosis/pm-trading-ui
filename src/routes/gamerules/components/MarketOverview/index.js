import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Img from 'components/layout/Img'
import Bold from 'components/layout/Bold'

const marketoverview1 = require('routes/gamerules/assets/marketoverview1.png')

const MarketOverview = () => (
  <Block margin="xl">
    <Subtitle>Market Overview</Subtitle>
    <Block margin="md">
      <Img src={marketoverview1} width={1140} />
    </Block>
    <Paragraph color="medium">
        Once logged in, you'll find <Bold>200 OLY tokens</Bold> in your wallet which you can use to make predictions on various topics. OLY is the official play-money token issued for the Olympia tournament.
      </Paragraph>
    <Paragraph>
        Using your OLY tokens, you can participate in prediction markets of your choice via the Markets page. The Markets page will provide you with an overview of all prediction markets. From the sidebar, you can easily filter this preview by market resolution, resolution date, and trading volume. If you’d like to look for a market by title or description, you’re able to do so through the designated data input forms.
      </Paragraph>
    <Paragraph>
        As you unlock new levels, new prediction markets with varying resolution dates will be offered to you so your predictive skills keep being challenged.
      </Paragraph>
    <Paragraph>
        Every two days, you'll also get a <Bold>top-up of new OLY tokens</Bold> that you can trade to unlock new markets and climb up the scoreboard.
      </Paragraph>
  </Block>
)

export default MarketOverview

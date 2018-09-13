import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Img from 'components/layout/Img'
import Bold from 'components/layout/Bold'

const marketoverview1 = require('routes/GameGuide/assets/marketoverview1.png')

const MarketOverview = () => (
  <Block margin="xl">
    <Subtitle>Market Overview</Subtitle>
    <Block margin="md">
      <Img src={marketoverview1} width={1140} bordered />
    </Block>
    <Paragraph>
      Once logged in, you&apos;ll find <Bold>200 OLY tokens</Bold> in your wallet which you can use to make predictions
      on various topics.
    </Paragraph>
    <Paragraph>
      Using your OLY tokens, you can participate in prediction markets of your choice via the Markets page. The Markets
      page provides an overview of all prediction markets. Throughout the tournament, new prediction markets with
      varying resolution dates will be offered to keep challenging your predictive skills.
    </Paragraph>
    <Paragraph>
      Every two days, we will topup your balance with new OLY tokens that can be used to trade, unlock new badges, and
      climb up the scoreboard.
    </Paragraph>
    <Paragraph>
      After the tournament ends, the final scoreboard will be released and winners will be announced.
    </Paragraph>
  </Block>
)

export default MarketOverview

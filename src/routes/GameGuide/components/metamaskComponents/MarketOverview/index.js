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
      Using your OLY tokens, you can participate in prediction markets of your choice via the Markets page. The Markets
      page provides an overview of all prediction markets. Throughout the tournament, new prediction markets with
      varying resolution dates will be offered to keep challenging your predictive skills.
    </Paragraph>
    <Paragraph>
    The tournament runs for two days during DappCon. At the end of the conference, the final scoreboard will be released and winners announced and rewarded.
    </Paragraph>
  </Block>
)

export default MarketOverview

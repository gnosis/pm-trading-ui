import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Img from 'components/layout/Img'

const dashboardoverview1 = require('routes/GameGuide/assets/dashboardoverview1.png')

const DashboardOverview = () => (
  <Block margin="xl">
    <Subtitle>Dashboard Overview</Subtitle>
    <Block margin="md">
      <Img src={dashboardoverview1} width={1140} />
    </Block>
    <Paragraph color="medium">
      From the Dashboard, you can stay on top of all active markets and your trading activity. <br />
      To get an overview of your trading activity, the top section will display the balance of OLY tokens you&apos;re
      currently holding, predicted profits from your investments, your rank on the scoreboard, as well as the predictor
      badge you&apos;ve been assigned.
    </Paragraph>
    <Paragraph>
      Different cards will give you a preview of new and soon-closing markets along with their current outcome
      prediction so you’ll never miss a chance to participate.
    </Paragraph>
    <Paragraph>
      A summary of your token holdings and trades from the markets you’ve participated in will show up in the bottom
      section.
    </Paragraph>
  </Block>
)

export default DashboardOverview

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
    <Paragraph>
      On the Dashboard, you can stay on top of all active markets and your trading activity. <br />
      The top section of the Dashboard provides an overview of your trading activity, displaying your OLY token balance,
      your predicted profits from current investments, your current scoreboard rank, as well as the most recent badge
      you have gained. The bottom section contains a summary of your token holdings and trades from the markets you’ve
      participated in.
    </Paragraph>
  </Block>
)

export default DashboardOverview

import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Bold from 'components/layout/Bold'

const Olympia = () => (
  <Block margin="xl">
    <Subtitle>3. Olympia</Subtitle>
    <Paragraph color="medium">
      <Bold>3.1</Bold> Olympia is Gnosis’ first prediction market tournament allowing participants to try out Gnosis’
      prediction market applications, gain honorary predictor badges and win GNO
      token rewards.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>3.2</Bold> Olympia is being run as a trial to demonstrate some of the features that are/will be available on
      Gnosis’ prediction market platform. Olympia is made available free of charge. Olympia is not being run for any
      commercial purpose with a view to profit or to enable participants to generate returns.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>3.3</Bold> To incentivise participation in Olympia, Gnosis may however offer GNO token rewards to the top
      performers / predictors. It is intended that GNO token rewards will be given to the top 100 predictors in Olympia.
      However, Gnosis reserves the right to revise or withdraw any GNO token rewards in our sole discretion.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>3.4</Bold> e do not guarantee that Olympia, or any content on it, will always be available or be
      uninterrupted. We may suspend or withdraw or restrict the availability of all or any part of Olympia for whatever
      reason in our sole discretion. We will try to give you reasonable notice of any suspension or withdrawal.
    </Paragraph>
  </Block>
)

export default Olympia

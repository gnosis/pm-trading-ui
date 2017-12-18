import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Bold from 'components/layout/Bold'

const OlympiaTokens = () => (
  <Block margin="xl">
    <Subtitle>6. OLY Tokens</Subtitle>
    <Paragraph color="medium">
      <Bold>6.1</Bold> OLY tokens are the official cryptographic tokens to be issued to users for participation in
      Olympia. Participants who successfully register to participate in Olympia will receive 200 OLY tokens into their
      wallet on the Start Date. Olympia participants shall receive a top-up of OLY tokens every two days during the
      Competition Period. The number of OLY tokens to be distributed during the Competition Period shall be determined
      by Gnosis in its sole discretion.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>6.2</Bold> OLY tokens can only be used to participate in a limited range of prediction markets that are made
      available as part of Olympia. Except as described in these Terms, OLY tokens cannot be used, liquidated, sold,
      traded or otherwise transferred and they have no inherent value that can be realised.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>6.3</Bold> OLY token profits or gains that you make on Olympia’s prediction markets do not represent money
      or money’s worth and do not have any value.
    </Paragraph>
  </Block>
)

export default OlympiaTokens

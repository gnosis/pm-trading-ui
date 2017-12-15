import Block from 'components/layout/Block'
import Bold from 'components/layout/Bold'
import PageFrame from 'components/layout/PageFrame'
import Paragraph from 'components/layout/Paragraph'
import Subtitle from 'components/layout/Subtitle'
import Title from 'components/layout/Title'
import * as React from 'react'

const TermsOfUse = () => (
  <PageFrame width="750px">
    <Block margin="md">
      <Title>UPORT TERMS OF USE</Title>
    </Block>
    <Block margin="xl">
      <Subtitle>Market Overview</Subtitle>
      <Paragraph color="medium">
        Once logged in, you&apos;ll find <Bold>200 OLY tokens</Bold> in your wallet which you can use to make
        predictions on various topics. OLY is the official play-money token issued for the Olympia tournament.
      </Paragraph>
      <Paragraph>
        Using your OLY tokens, you can participate in prediction markets of your choice via the Markets page.
        The Markets page will provide you with an overview of all prediction markets. From the sidebar, you
        can easily filter this preview by market resolution, resolution date, and trading volume. If you’d
        like to look for a market by title or description, you’re able to do so through the designated data
        input forms.
      </Paragraph>
    </Block>
  </PageFrame>
)

export default TermsOfUse

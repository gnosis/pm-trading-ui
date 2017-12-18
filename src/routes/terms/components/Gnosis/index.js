import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Bold from 'components/layout/Bold'

const Gnosis = () => (
  <Block margin="xl">
    <Subtitle>2. Gnosis</Subtitle>
    <Paragraph color="medium">
      <Bold>2.1</Bold> Gnosis is registered in Gibraltar under company number 115571, with its registered office at
      Suite 23 Portland House, Glacis Road, Gibraltar.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>2.2</Bold> Gnosis is the developer and operator of a platform for decentralised prediction markets, which
      enable the aggregation of information from different sources to forecast the expected outcome of a future event.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>2.3</Bold> You can contact us by writing to us at <a href="mailto:info@gnosis.pm">info@gnosis.pm</a>
    </Paragraph>
  </Block>
)

export default Gnosis

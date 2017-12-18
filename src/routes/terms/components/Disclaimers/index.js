import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Bold from 'components/layout/Bold'

const Disclaimers = () => (
  <Block margin="xl">
    <Subtitle>8. Disclaimers</Subtitle>
    <Paragraph color="medium">
      <Bold>8.1</Bold> You understand and accept that you use the Services at your own risk and discretion. Gnosis
      provides the Services to you on an “as is” and “as available” without any warranty, representation or assurance
      (whether express or implied) in relation to merchantability, fitness for a particular purpose, availability,
      security, title or non-infringement.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>8.2</Bold> Although Gnosis will adopt reasonable security protocols and measures in the provision of the
      Services, we do not warrant, represent or guarantee that the Services will be secure or free from weaknesses,
      vulnerabilities, bugs or viruses. You are responsible for configuring your information technology, computer
      programmes and platform to access the Services. You should use your own virus protection software.
    </Paragraph>
  </Block>
)

export default Disclaimers

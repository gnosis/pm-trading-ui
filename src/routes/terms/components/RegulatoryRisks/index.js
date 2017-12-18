import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Bold from 'components/layout/Bold'

const RegulatoryRisks = () => (
  <Block margin="xl">
    <Subtitle>9. Regulatory risks</Subtitle>
    <Paragraph color="medium">
      <Bold>9.1</Bold> The operation of prediction market applications is subject to extensive legal and regulatory
      analysis. Participation in and the format of Olympia are being carefully designed to minimize any legal and
      regulatory risk. Gnosis will, at all times, comply with regulatory inquiries and will respond quickly and swiftly
      to relevant regulatory authorities.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>9.2</Bold> Any regulatory inquiry may mean the immediate suspension or outright termination of Olympia or
      other Services for all participants. All rewards/tournaments/markets may be cancelled in the event of a regulatory
      inquiry. Gnosis will, at all times, comply with any regulatory inquiries.
    </Paragraph>
  </Block>
)

export default RegulatoryRisks

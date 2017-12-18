import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Bold from 'components/layout/Bold'

const LiabilityLimitation = () => (
  <Block margin="xl">
    <Subtitle>12. Limitation of Liability</Subtitle>
    <Paragraph color="medium">
      <Bold>12.1</Bold> Gnosis shall not be liable to you for any direct, indirect, special, incidental or consequential
      loss of any kind (including, but not limited to, loss of revenue, income, business or profits, loss of contract or
      depletion of goodwill, loss of anticipated savings, loss of use or data, consequential, indirect, incidental,
      special, exemplary, punitive or enhanced damages, or damages for business interruption or any like loss) arising
      out of or in any way related to your access to and use of the Services or your inability to access and use the
      Services, regardless of the cause of action, whether based in contract, tort (including negligence), breach of
      statutory duty, restitution or any other legal or equitable basis (even if we have been advised of the possibility
      of such losses and regardless of whether such losses were foreseeable).
    </Paragraph>
    <Paragraph color="medium">
      <Bold>12.2</Bold> Nothing in these Terms shall limit or exclude liability for any matter in respect of which it
      would be unlawful to limit or exclude liability.
    </Paragraph>
  </Block>
)

export default LiabilityLimitation

import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Bold from 'components/layout/Bold'

const HowTo = () => (
  <Block margin="xl">
    <Subtitle>4. Olympia - How to register / participate</Subtitle>
    <Paragraph color="medium">
      <Bold>4.1</Bold> Olympia will run for a limited period of time (“Competition Period”). The Competition Period
      shall start at 14:00 UTC on 18th December 2017 ("Start Date") and shall end at 23:00 UTC on 5th January 2018 ("End
      Date").
    </Paragraph>
    <Paragraph color="medium">
      <Bold>4.2</Bold> To participate in Olympia, you must sign up to and verify your identity using the uPort app on:
      <Block>
        <Bold>Android</Bold> (<a href="https://play.google.com/store/apps/details?id=com.uportMobile&hl=en">
          https://play.google.com/store/apps/details?id=com.uportMobile&hl=en
        </a>); or
      </Block>{' '}
      <Bold>iOS</Bold>&nbsp; (<a href="https://itunes.apple.com/de/app/uport-id/id1123434510?l=en&mt=8">
        https://itunes.apple.com/de/app/uport-id/id1123434510?l=en&mt=8
      </a>) .
    </Paragraph>
    <Paragraph color="medium">
      <Bold>4.3</Bold> Participants may only have one user account to participate in Olympia. Participation in Olympia
      is not permitted with multiple accounts.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>4.4</Bold> Gnosis reserves the right in its sole discretion to: (i) limit participation in Olympia to a
      specified number of persons; (ii) refuse to allow a person from participating in Olympia; and/or (iii) remove or
      exclude any person from participating in Olympia after the Start Date for whatever reason.
    </Paragraph>
  </Block>
)

export default HowTo

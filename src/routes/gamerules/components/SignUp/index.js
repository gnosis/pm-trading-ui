import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'

const SignUp = () => (
  <Block margin="xl">
    <Subtitle>Sign-up</Subtitle>
    <Paragraph color="medium">
        To participate in our two-week tournament, verify your identity by signing up via the uPort app on Android or iOS. <br /><br />
        uPort is a secure, easy-to-use system for self-sovereign identity, built on Ethereum. uPort identities are fully
         owned and controlled by the creator, and don't rely on centralized third-parties for creation or validation.
          Via uPort, you can own and control your personal identity; securely and selectively disclose your data to counterparties, and interact with decentralized applications and smart contracts such as Gnosis.
      </Paragraph>
  </Block>
)

export default SignUp

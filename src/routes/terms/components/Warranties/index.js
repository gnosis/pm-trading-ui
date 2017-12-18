import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Bold from 'components/layout/Bold'

const Warranties = () => (
  <Block margin="xl">
    <Subtitle>10. Warranties & Representations</Subtitle>
    <Paragraph color="medium">
      <Bold>10.1</Bold> You warrant and represent that you shall not misuse the Services by knowingly introducing
      viruses, trojans, bugs, worms or other material that is malicious or technologically harmful. You shall not
      attempt to gain unauthorised access to the Services. In the event you introduce or seek to introduce any harmful
      material into the Services or otherwise attack the Services in any way, we reserve the right to report any such
      activity to the relevant law enforcement authorities and we will co-operate with those authorities by disclosing
      your identity to them. In the event of such breach, your right to use the Services will cease immediately.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>10.2</Bold> By using the Services, you warrant and represent that you understand the inherent risks
      associated with cryptographic systems; and warrant that you have an understanding of the usage and intricacies of
      public/private key cryptography, cryptographic tokens, like Ether (ETH) and Bitcoin (BTC), smart contract based
      tokens such as those that follow the Ethereum Token Standard (<a href="https://github.com/ethereum/EIPs/issues/20">
        https://github.com/ethereum/EIPs/issues/20
      </a>), and blockchain-based software systems.
    </Paragraph>
  </Block>
)

export default Warranties

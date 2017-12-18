import * as React from 'react'
import Block from 'components/layout/Block'
import Subtitle from 'components/layout/Subtitle'
import Paragraph from 'components/layout/Paragraph'
import Bold from 'components/layout/Bold'

const ScopeOfTerms = () => (
  <Block margin="xl">
    <Subtitle>1. Scope of Terms</Subtitle>
    <Paragraph color="medium">
      <Bold>1.1</Bold> These Terms of Use (<Bold>“Terms”</Bold>) are a contract between you and Gnosis Ltd (<Bold>
        “Gnosis”, “We”, “Our” or “Us”
      </Bold>). They govern your use of Gnosis’ sites, services, mobile apps, software, products, tools, smart
      contracts, materials and content, including Olympia (<Bold>“Services”</Bold>).
    </Paragraph>
    <Paragraph color="medium">
      <Bold>1.2</Bold> By using the Services, you confirm that you accept these Terms and that you agree to comply with
      them. If you don’t agree to any of these Terms, you must not use the Services.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>1.3</Bold> You are responsible for ensuring that all persons who access or use the Services through your
      device or internet connection are aware of these Terms, and that they comply with them.
    </Paragraph>
    <Paragraph color="medium">
      <Bold>1.4</Bold> We may amend these Terms from time to time in our sole discretion. Every time you wish to use the
      Services, please check these Terms to ensure you understand the terms that apply at that time.
    </Paragraph>
  </Block>
)

export default ScopeOfTerms

import * as React from 'react'
import Block from 'components/layout/Block'
import Paragraph from 'components/layout/Paragraph'
import './Footer.less'

const Footer = () => (
  <Block className="footer">
    <Paragraph color="medium">
      Trading on prediction markets carry a high degree of financial risk to your capital. Please read our full{' '}
      <a href="/TermsOfService.html" target="_blank" className="footerLink">
        Risk Disclaimer
      </a>{' '}
      and{' '}
      <a href="/TermsOfService.html" target="_blank" className="footerLink">
        Terms of Service
      </a>{' '}
      before trading
    </Paragraph>
  </Block>
)

export default Footer

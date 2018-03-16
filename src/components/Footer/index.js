import * as React from 'react'
import Block from 'components/layout/Block'
import Paragraph from 'components/layout/Paragraph'
import { getFooterText } from 'utils/configuration'

const footerText = getFooterText()

const Footer = () =>
  (footerText.length > 1 ? (
    <Block margin="md">
      <Paragraph center color="medium">
        {footerText}
      </Paragraph>
    </Block>
  ) : (
    <div />
  ))

export default Footer

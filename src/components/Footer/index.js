import React from 'react'
import Markdown from 'react-markdown'
import cn from 'classnames/bind'
import Block from 'components/layout/Block'
import Paragraph from 'components/layout/Paragraph'
import { getFooterContent } from 'utils/configuration'
import footerText from './footerText.txt'
import style from './Footer.mod.scss'

const cx = cn.bind(style)
const { type, source, markdown } = getFooterContent()

const Footer = () => {
  let text

  if (type === 'text') {
    text = source
  } else if (type === 'file') {
    text = footerText
  }

  return (
    <Block margin="md">
      {markdown ? (
        <Markdown source={text} className={cx('footerContainer')} />
      ) : (
        <Paragraph center color="medium">
          {source}
        </Paragraph>
      )}
    </Block>
  )
}

export default Footer

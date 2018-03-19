import * as React from 'react'
import Markdown from 'react-markdown'
import cn from 'classnames/bind'
import Block from 'components/layout/Block'
import Paragraph from 'components/layout/Paragraph'
import { getFooterText } from 'utils/configuration'
import style from './Footer.mod.scss'

const cx = cn.bind(style)
const footerText = getFooterText()

const Footer = () =>
  (footerText.length > 1 ? (
    <Block margin="md">
      <Markdown source={footerText} className={cx('footerContainer')} />
    </Block>
  ) : (
    <div />
  ))

export default Footer

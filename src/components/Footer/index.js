import React from 'react'
import Markdown from 'react-markdown'
import cn from 'classnames/bind'
import Paragraph from 'components/layout/Paragraph'
import { getFeatureConfig } from 'utils/features'
import style from './Footer.mod.scss'

const cx = cn.bind(style)
const {
  content: {
    type, fileName, source, markdown,
  },
} = getFeatureConfig('footer')

const footerText = require(`assets/content/${fileName || 'footer'}.md`)

const Footer = () => {
  let text

  if (type === 'text') {
    text = source
  } else if (type === 'file') {
    text = footerText
  }

  return (
    <div className={cx('footer')}>
      <div className={cx('container')}>
        <div className={cx('row')}>
          <div className={cx('col-xs-12')}>

            {markdown ? (
              <Markdown source={text} className={cx('footerContainer')} />
            ) : (
              <Paragraph center color="medium" className={cx('footerContainer')}>
                {source}
              </Paragraph>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer

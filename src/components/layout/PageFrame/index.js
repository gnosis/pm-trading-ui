import classNames from 'classnames/bind'
import Block from 'components/layout/Block'
import PropTypes from 'prop-types'
import React from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

const PageFrame = ({ width, children }) =>
  <Block className={cx('container', 'pageFrame')} width={width}>
    { children }
  </Block>

PageFrame.propTypes = {
  children: PropTypes.node,
  width: PropTypes.string,
}

export default PageFrame

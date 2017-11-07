import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

class Img extends PureComponent {

  render() {
    const { fullwidth, alt, bordered, className, ...props } = this.props

    return <img alt={alt} {...props} className={cx('ol-img', { fullwidth, bordered }, className)} />
  }
}

Img.propTypes = {
  alt: PropTypes.string,
  fullwidth: PropTypes.bool,
  bordered: PropTypes.bool,
  className: PropTypes.string,
}

export default Img

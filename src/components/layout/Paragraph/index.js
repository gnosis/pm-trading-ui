import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

class Paragraph extends PureComponent {
  render() {
    const {
      children, color, center, size, nomargin, ...props
    } = this.props
    const noMargin = nomargin ? 'no-margin' : undefined

    return (
      <p className={cx('default-paragraph', color, noMargin, size, { center })} {...props}>
        { children }
      </p>
    )
  }
}

Paragraph.propTypes = {
  size: PropTypes.oneOf(['normal', 'small']),
  nomargin: PropTypes.bool,
  center: PropTypes.bool,
  color: PropTypes.oneOf(['soft', 'medium', 'dark', 'primary']),
  children: PropTypes.node,
}

Paragraph.defaultProps = {
  size: 'normal',
  center: false,
  color: undefined,
  children: undefined,
  nomargin: false,
}

export default Paragraph

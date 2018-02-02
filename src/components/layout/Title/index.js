import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import * as css from './index.scss'

const cx = classNames.bind(css)

class Title extends PureComponent {
  render() {
    const { children, ...props } = this.props

    return (
      <h1 className={cx('ol-title')} {...props}>
        { children }
      </h1>
    )
  }
}

Title.propTypes = {
  children: PropTypes.node,
}

export default Title

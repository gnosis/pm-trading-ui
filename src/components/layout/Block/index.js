import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import css from './index.scss'

const cx = classNames.bind(css)

class Block extends PureComponent {
  get blockStyle() {
    return {
      width: this.props.width,
    }
  }

  render() {
    const {
      margin, center, children, className, ...props
    } = this.props

    return (
      <div className={cx(margin, className, { center })} style={this.blockStyle} {...props}>
        {children}
      </div>
    )
  }
}

Block.propTypes = {
  width: PropTypes.string,
  margin: PropTypes.string,
  center: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
}

export default Block

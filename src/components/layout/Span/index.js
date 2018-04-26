import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

class Span extends PureComponent {
  render() {
    const { children, ...props } = this.props

    return (
      <span {...props}>
        { children }
      </span>
    )
  }
}

Span.propTypes = {
  children: PropTypes.node,
}

Span.defaultProps = {
  children: null,
}

export default Span

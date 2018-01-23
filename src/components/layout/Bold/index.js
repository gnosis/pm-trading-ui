import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

class Bold extends PureComponent {
  render() {
    const { children, ...props } = this.props

    return (
      <b {...props}>
        { children }
      </b>
    )
  }
}

Bold.propTypes = {
  children: PropTypes.node,
}

export default Bold

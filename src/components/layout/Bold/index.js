import PropTypes from 'prop-types'
import * as React from 'react'

class Bold extends React.PureComponent {

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

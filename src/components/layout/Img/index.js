import PropTypes from 'prop-types'
import * as React from 'react'

class Img extends React.PureComponent {

    render() {
        const { ...props } = this.props

        return <img {...this.props} />
    }
}

Img.propTypes = {
    alt: PropTypes.string,
}

export default Img

import PropTypes from 'prop-types'
import * as React from 'react'

class Paragraph extends React.PureComponent {

    render() {
        const { children, ...props } = this.props

        return (
            <p { ...props }>
                { children }
            </p>
        )
    }
}

Paragraph.propTypes = {
    children: PropTypes.node,
}

export default Paragraph

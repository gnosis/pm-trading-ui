import PropTypes from 'prop-types'
import * as React from 'react'

class Block extends React.PureComponent {

    render() {
        const { children, ...props } = this.props

        return (
            <div { ...props }>
                { children }
            </div>
        )
    }
}

Block.propTypes = {
    children: PropTypes.node,
}

export default Block

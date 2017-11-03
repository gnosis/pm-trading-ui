import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import * as React from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

class Block extends React.PureComponent {

    get blockStyle() {
        return {
            width: this.props.width,
        }
    }

    render() {
        const { margin, center, children, className } = this.props

        return (
          <div className={cx(margin, className, { center })} style={this.blockStyle}>
            { children }
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

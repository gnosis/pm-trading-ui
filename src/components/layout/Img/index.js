import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import * as React from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

class Img extends React.PureComponent {

    render() {
        const { fullwidth, className, ...props } = this.props

        return <img {...this.props} className={cx({ fullwidth }, className)} />
    }
}

Img.propTypes = {
    alt: PropTypes.string,
    fullwidth: PropTypes.bool,
}

export default Img

import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import * as React from 'react'
import * as css from './index.css'

const cx = classNames.bind(css)

class Paragraph extends React.PureComponent {

    render() {
        const { children, color, nomargin, ...props } = this.props
        const noMargin = nomargin ? 'no-margin' : undefined
        return (
          <p className={cx('default-paragraph', color, noMargin)} {...props}>
            { children }
          </p>
        )
    }
}

Paragraph.propTypes = {
    nomargin: PropTypes.bool,
    color: PropTypes.string,
    children: PropTypes.node,
}

export default Paragraph

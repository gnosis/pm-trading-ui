import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import moment from 'moment'

import { RESOLUTION_TIME } from 'utils/constants'

class Countdown extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const { interval = 1000 } = this.props
    this.updateInterval = setInterval(this.updateDuration, interval)
    this.updateDuration()
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval)
  }

  @autobind
  updateDuration() {
    const { target, format = RESOLUTION_TIME.RELATIVE_LONG_FORMAT } = this.props
    const duration = moment.duration(moment.utc(target).diff(moment()))

    this.setState({ output: duration.format(format) })
  }

  render() {
    const { className } = this.props
    const { output } = this.state
    return (
      <span className={className}>
        {output}
      </span>
    )
  }
}

Countdown.propTypes = {
  target: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  className: PropTypes.string,
  interval: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

Countdown.defaultProps = {
  className: '',
  interval: 1000,
}

export default Countdown

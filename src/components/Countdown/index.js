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
    this.updateInterval = setInterval(this.updateDuration, 1000)
    this.updateDuration()
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval)
  }

  @autobind
  updateDuration() {
    const { til, target, format = RESOLUTION_TIME.RELATIVE_LONG_FORMAT } = this.props

    const duration = moment.duration(moment.utc(target).diff(til))
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
  til: PropTypes.instanceOf(moment),
  target: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  className: PropTypes.string,
}

Countdown.defaultProps = {
  className: '',
  til: moment(),
}

export default Countdown

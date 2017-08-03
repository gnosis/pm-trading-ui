import React, { Component } from 'react'
import autobind from 'autobind-decorator'

import moment from 'moment'

import { RESOLUTION_TIME } from 'utils/constants'

class Countdown extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  @autobind
  updateDuration() {
    const { til = moment(), target, format = RESOLUTION_TIME.RELATIVE_LONG_FORMAT } = this.props

    const duration = moment.duration(moment(target).diff(til))
    this.setState({ output: duration.format(format) })
  }

  componentDidMount() {
    this.updateInterval = setInterval(this.updateDuration, 1000)
    this.updateDuration()
  }

  componentWillUnmount() {
    clearInterval(this.updateInterval)
  }

  render() {
    return (
      <span>{this.state.output}</span>
    )
  }
}

export default Countdown
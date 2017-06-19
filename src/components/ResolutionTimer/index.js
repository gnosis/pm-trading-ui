import React, { Component } from 'react'

import moment from 'moment'

export default class ResolutionTimer extends Component {
  /*
  constructor(props) {
    const { target } = props

    this.state = {
      difference: moment(target).diff(moment())
    }
  }

  componentDidMount() {
    setInterval(() => {
      console.log("updating")

      this.setState({ difference: moment(this.props.target).diff(moment()) })
    }, 1000)
  }*/

  render() {
    return (
      <span>{ moment(this.props.target).toNow(true) }</span>
    )
  }
}

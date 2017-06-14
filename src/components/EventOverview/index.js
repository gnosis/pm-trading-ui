import React, { Component } from 'react'

export default class EventOverview extends Component {
  componentWillMount() {
    const { wallet } = this.props

    wallet.getNetwork()
      .then(console.log)

    wallet.getAccount()
      .then(console.log)
  }

  render() {
    const { wallet } = this.props

    return (
      <div className="eventOverview">
        Hello
      </div>
    )
  }
}

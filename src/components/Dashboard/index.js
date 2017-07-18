import React, { Component } from 'react'
import autobind from 'autobind-decorator'

import './dashboard.less'

const EXPAND_DEPOSIT = 'DEPOSIT'
const EXPAND_WITHDRAW = 'WITHDRAW'

const controlButtons = {
  [EXPAND_DEPOSIT]: {
    label: 'Make Deposit',
    className: 'btn btn-primary',
    component: <span>Make Deposit</span>,
  },
  [EXPAND_WITHDRAW]: {
    label: 'Withdraw Money',
    className: 'btn btn-default',
    component: <span>Withdraw Money</span>,
  },
}

export default class Dashboard extends Component {

	constructor(props) {
    super(props)

    this.state = {
      expandableSelected: undefined,
    }
  }

  @autobind
  handleExpand(type) {
    // Toggle
    this.setState({ visibleControl: (this.state.visibleControl === type ? null : type) })
  }

  renderExpandableContent() {
    const { visibleControl } = this.state

    if (visibleControl === EXPAND_DEPOSIT) {
      const {
        market,
        selectedCategoricalOutcome,
        selectedBuyInvest,
        buyShares
      } = this.props

      return (
        <span>Something comes here</span>
      )
    }
  }


  renderControls() {
    return (
      <div className="marketControls container">
        <div className="row">
          {Object.keys(controlButtons).map(type => (
            <button
              key={type}
              type="button"
              className={`
                marketControls__button
                ${controlButtons[type].className}
                ${type === this.state.visibleControl ? 'marketControls__button--active' : ''}`
              }
              onClick={() => this.handleExpand(type)}
            >
              {controlButtons[type].label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="dashboardPage">
        <div className="marketListPage__header">
          <div className="container">
          	<div className="row">
          		<div className="col-md-12">
          			<h1 className="marketTitle__heading">Welcome!</h1>
          			<p className="marketDescription__text">Here is what happened since your last visit.</p>
          		</div>
          	</div>
          </div>
        </div>
        <div className="marketListPage__stats">
          <div className="container">
            <div className="row marketStats">
              <div className="col-md-3 marketStats__stat">
                <div className="marketStats__icon icon icon--market" />
                <span className="marketStats__value">Value</span>
                <div className="marketStats__label">Open Markets</div>
              </div>
              <div className="col-md-3 marketStats__stat">
                <div className="marketStats__icon icon icon--market--countdown" />
                <span className="marketStats__value">Value</span>
                <div className="marketStats__label">Closing Soon</div>
              </div>
              <div className="col-md-3 marketStats__stat">
                <div className="marketStats__icon icon icon--new" />
                <span className="marketStats__value">Value</span>
                <div className="marketStats__label">New Markets</div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </div>
        </div>
        { this.renderControls() }
        <div className="expandable">
          <div className="container">
            { this.renderExpandableContent() }
          </div>
        </div>
        <div className="marketListPage__markets">
          <div className="container">
            <div className="row">
            	widgets
            </div>
          </div>

        </div>
      </div>
    )
  }
}

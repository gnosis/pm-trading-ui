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

  componentWillMount() {
    this.props.requestMarkets()
  }

  @autobind
  handleViewMarket(market) {
    this.props.changeUrl(`/markets/${market.address}`)
  }

  @autobind
  handleCreateMarket() {
  /*
    const options = {
      title: 'Test Market',
      description: 'Test123',
      outcomes: ['Yes', 'No'],
      resolutionDate: new Date().toISOString(),
      funding: new BigNumber('0.2345'),
      fee: new BigNumber('12.00'),
      eventType: 'CATEGORICAL',
      oracleType: 'CENTRALIZED',
    }

    this.props.createMarket(options)*/
    this.props.changeUrl(`/markets/new`)
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
      	<div className="expandable__inner">
          <div className="container">
        		<span>Something comes here</span>
        	</div>
        </div>
      )
    }
  }


  renderControls() {
    return (
      <div className="dashboardControls container">
        <div className="row">
          {Object.keys(controlButtons).map(type => (
            <button
              key={type}
              type="button"
              className={`
                dashboardControls__button
                ${controlButtons[type].className}
                ${type === this.state.visibleControl ? 'dashboardControls__button--active' : ''}`
              }
              onClick={() => this.handleExpand(type)}
            >
              {controlButtons[type].label}
            </button>
          ))}
          <button type="button" onClick={this.handleCreateMarket} className="dashboardControls__button btn btn-default">Create Market</button>
        </div>
      </div>
    )
  }


  renderWidget(marketType) {
    const { markets } = this.props

    if (marketType == 'newMarkets') {

    	return (
     	<div className="dashboardWidget col-md-6">
          <div className="dashboardWidget__title">New Markets</div>
          <div className="dashboardWidget__container">

          	<div className="dashboardMarket dashboardMarket--new">
            	<div className="dashboardMarket__title">Something</div>
            	<div className="outcome">
			          <div className="outcome__bar">
			            <div
			              className="outcome__bar--inner"
			              style={{ width: `${.54 * 100}%`, 'backgroundColor': '#f2cc0a' }}
			            >
			            	<div className="outcome__bar--value">54%</div>
			              <div className="outcome__bar--label">May 2017</div>
			            </div>
			          </div>
			        </div>
          	</div>

          	<div className="dashboardMarket dashboardMarket--new">
            	<div className="dashboardMarket__title">Something different with a longer title to break the line for styling review.</div>
            	<div className="outcome">
			          <div className="outcome__bar">
			            <div
			              className="outcome__bar--inner"
			              style={{ width: `${0.91 * 100}%`, 'backgroundColor': '#e01563' }}
			            >
			            	<div className="outcome__bar--value">91%</div>
			              <div className="outcome__bar--label">No</div>
			            </div>
			          </div>
			        </div>
          	</div>

          </div>
        </div>
    	)

    }

    if (marketType == 'hotMarkets') {

    	return (
     	<div className="dashboardWidget col-md-6">
          <div className="dashboardWidget__title">Hot Markets</div>
          <div className="dashboardWidget__container">

          	<div className="dashboardMarket dashboardMarket--hot dashboardMarket--twoColumns">
          		<div className="dashboardMarket__leftCol">
          			<div className="value">1315</div>
          			<div className="caption">Trading</div>
          		</div>
          		<div className="dashboardMarket__rightCol">
          			<div className="dashboardMarket__title">Something</div>
	            	<div className="outcome">
				          <div className="outcome__bar">
				            <div
				              className="outcome__bar--inner"
				              style={{ width: `${.50 * 100}%`, 'backgroundColor': '#9c8ae3' }}
				            >
				            	<div className="outcome__bar--value">50%</div>
				              <div className="outcome__bar--label">Blue Jeans</div>
				            </div>
				          </div>
				        </div>
          		</div>
          	</div>

          	<div className="dashboardMarket dashboardMarket--hot dashboardMarket--twoColumns">
          		<div className="dashboardMarket__leftCol">
          			<div className="value">299</div>
          			<div className="caption">Trading</div>
          		</div>
          		<div className="dashboardMarket__rightCol">
            	<div className="dashboardMarket__title">Something different with a longer title to break the line for styling review.</div>
	            	<div className="outcome">
				          <div className="outcome__bar">
				            <div
				              className="outcome__bar--inner"
				              style={{ width: `${.73 * 100}%`, 'backgroundColor': '#f2cc0a' }}
				            >
				            	<div className="outcome__bar--value">73%</div>
				              <div className="outcome__bar--label">Blue Jeans</div>
				            </div>
				          </div>
				        </div>
          		</div>
          	</div>

          	<div className="dashboardMarket dashboardMarket--hot dashboardMarket--twoColumns">
          		<div className="dashboardMarket__leftCol">
          			<div className="value">98</div>
          			<div className="caption">Trading</div>
          		</div>
          		<div className="dashboardMarket__rightCol">
          			<div className="dashboardMarket__title">Something else wow looking good</div>
	            	<div className="outcome">
				          <div className="outcome__bar">
				            <div
				              className="outcome__bar--inner"
				              style={{ width: `${1 * 100}%`, 'backgroundColor': '#0be1b1' }}
				            >
				            	<div className="outcome__bar--value">100%</div>
				              <div className="outcome__bar--label">Blue Jeans</div>
				            </div>
				          </div>
				        </div>
          		</div>
          	</div>

          </div>
        </div>
    	)

    }

    if (marketType == 'closingMarkets') {

    	return (
     	<div className="dashboardWidget col-md-6">
          <div className="dashboardWidget__title">Soon-Closing Markets</div>
          <div className="dashboardWidget__container">

          	<div className="dashboardMarket dashboardMarket--closing dashboardMarket--twoColumns">
          		<div className="dashboardMarket__leftCol">
          			<div className="value">1315</div>
          			<div className="caption">Trading</div>
          		</div>
          		<div className="dashboardMarket__rightCol">
          			<div className="dashboardMarket__title">Something</div>
	            	<div className="outcome">
				          <div className="outcome__bar">
				            <div
				              className="outcome__bar--inner"
				              style={{ width: `${.50 * 100}%`, 'backgroundColor': '#9c8ae3' }}
				            >
				            	<div className="outcome__bar--value">50%</div>
				              <div className="outcome__bar--label">Blue Jeans</div>
				            </div>
				          </div>
				        </div>
          		</div>
          	</div>

          	<div className="dashboardMarket dashboardMarket--closing dashboardMarket--twoColumns">
          		<div className="dashboardMarket__leftCol">
          			<div className="value">299</div>
          			<div className="caption">Trading</div>
          		</div>
          		<div className="dashboardMarket__rightCol">
            	<div className="dashboardMarket__title">Something different with a longer title to break the line for styling review.</div>
	            	<div className="outcome">
				          <div className="outcome__bar">
				            <div
				              className="outcome__bar--inner"
				              style={{ width: `${.73 * 100}%`, 'backgroundColor': '#f2cc0a' }}
				            >
				            	<div className="outcome__bar--value">73%</div>
				              <div className="outcome__bar--label">Blue Jeans</div>
				            </div>
				          </div>
				        </div>
          		</div>
          	</div>

          	<div className="dashboardMarket dashboardMarket--closing dashboardMarket--twoColumns">
          		<div className="dashboardMarket__leftCol">
          			<div className="value">98</div>
          			<div className="caption">Trading</div>
          		</div>
          		<div className="dashboardMarket__rightCol">
          			<div className="dashboardMarket__title">Something else wow looking good</div>
	            	<div className="outcome">
				          <div className="outcome__bar">
				            <div
				              className="outcome__bar--inner"
				              style={{ width: `${1 * 100}%`, 'backgroundColor': '#0be1b1' }}
				            >
				            	<div className="outcome__bar--value">100%</div>
				              <div className="outcome__bar--label">Blue Jeans</div>
				            </div>
				          </div>
				        </div>
          		</div>
          	</div>

          </div>
        </div>
    	)

    }

    if (marketType == 'myHoldings') {

    	return (
     	<div className="dashboardWidget dashboardWidget--financial col-md-6">
          <div className="dashboardWidget__title">My Holdings</div>
          <div className="dashboardWidget__container">

          	<div className="dashboardMarket dashboardMarket--closing dashboardMarket--twoColumns dashboardMarket--onDark">
          		<div className="dashboardMarket__leftCol">
          			<div className="value">1315</div>
          			<div className="caption">Trading</div>
          		</div>
          		<div className="dashboardMarket__rightCol">
          			<div className="dashboardMarket__title">Something</div>
	            	<div className="outcome">
				          <div className="outcome__bar">
				            <div
				              className="outcome__bar--inner"
				              style={{ width: `${.50 * 100}%`, 'backgroundColor': '#9c8ae3' }}
				            >
				            	<div className="outcome__bar--value">50%</div>
				              <div className="outcome__bar--label">Blue Jeans</div>
				            </div>
				          </div>
				        </div>
          		</div>
          	</div>

          	<div className="dashboardMarket dashboardMarket--closing dashboardMarket--twoColumns dashboardMarket--onDark">
          		<div className="dashboardMarket__leftCol">
          			<div className="value">299</div>
          			<div className="caption">Trading</div>
          		</div>
          		<div className="dashboardMarket__rightCol">
            	<div className="dashboardMarket__title">Something different with a longer title to break the line for styling review.</div>
	            	<div className="outcome">
				          <div className="outcome__bar">
				            <div
				              className="outcome__bar--inner"
				              style={{ width: `${.73 * 100}%`, 'backgroundColor': '#f2cc0a' }}
				            >
				            	<div className="outcome__bar--value">73%</div>
				              <div className="outcome__bar--label">Blue Jeans</div>
				            </div>
				          </div>
				        </div>
          		</div>
          	</div>

          	<div className="dashboardMarket dashboardMarket--closing dashboardMarket--twoColumns dashboardMarket--onDark">
          		<div className="dashboardMarket__leftCol">
          			<div className="value">98</div>
          			<div className="caption">Trading</div>
          		</div>
          		<div className="dashboardMarket__rightCol">
          			<div className="dashboardMarket__title">Something else wow looking good</div>
	            	<div className="outcome">
				          <div className="outcome__bar">
				            <div
				              className="outcome__bar--inner"
				              style={{ width: `${1 * 100}%`, 'backgroundColor': '#0be1b1' }}
				            >
				            	<div className="outcome__bar--value">100%</div>
				              <div className="outcome__bar--label">Blue Jeans</div>
				            </div>
				          </div>
				        </div>
          		</div>
          	</div>

          </div>
        </div>
    	)

    }
  }

  render() {
  	const { markets } = this.props
    return (
      <div className="dashboardPage">
        <div className="dashboardPage__header">
          <div className="container">
          	<div className="row">
          		<div className="col-md-12">
          			<h1>Welcome!</h1>
          			<p className="marketDescription__text">Here is what happened since your last visit.</p>
          		</div>
          	</div>
          </div>
        </div>
        <div className="dashboardPage__stats">
          <div className="container">
            <div className="row dashboardStats">
              <div className="col-md-3 dashboardStats__stat">
                <div className="dashboardStats__icon icon icon--etherTokens" />
                <span className="dashboardStats__value">235</span>
                <div className="dashboardStats__label">Ether Tokens</div>
              </div>
              <div className="col-md-3 dashboardStats__stat">
                <div className="dashboardStats__icon icon icon--incomeForecast" />
                <span className="dashboardStats__value">Value</span>
                <div className="dashboardStats__label">Predicted Profits</div>
              </div>
              <div className="col-md-3 dashboardStats__stat">
                <div className="dashboardStats__icon icon icon--new" />
                <span className="dashboardStats__value">Value</span>
                <div className="dashboardStats__label">Participating in Markets</div>
              </div>
              <div className="col-md-3">
              </div>
            </div>
          </div>
        </div>
        { this.renderControls() }
        <div className="expandable">
          { this.renderExpandableContent() }
        </div>
        <div className="dashboardWidgets dashboardWidgets--markets">
          <div className="container">
            <div className="row">
            	{ this.renderWidget("newMarkets") }
            	{ this.renderWidget("hotMarkets") }
            </div>
            <div className="row">
            	{ this.renderWidget("closingMarkets") }
            	{ this.renderWidget("myMarkets") }
            </div>
          </div>
        </div>
        <div className="dashboardWidgets dashboardWidgets--financial">
          <div className="container">
            <div className="row">
            	{ this.renderWidget("myHoldings") }
            	{ this.renderWidget("myTrades") }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

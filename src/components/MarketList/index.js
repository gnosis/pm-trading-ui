import React, { Component } from 'react'
import { Link } from 'react-router'
import autobind from 'autobind-decorator'
import { schemeDark2 } from 'd3-scale-chromatic'
import { scaleOrdinal } from 'd3'
import moment from 'moment'
import 'moment-duration-format'
import { reduxForm, submit, Field } from 'redux-form'

import FormSelect from 'components/FormSelect'

import './marketList.less'

import { RESOLUTION_TIME } from 'utils/constants'

class MarketList extends Component {
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

  renderCategoricalOutcomes(outcomes, resolved) {
    let renderOutcomes = outcomes

    if (resolved) {
      // test
      renderOutcomes = [outcomes[0]]
    }

    const colorScale = scaleOrdinal(schemeDark2)
    colorScale.domain(outcomes)


    return (<div className="market__outcomes">
      {renderOutcomes.map((outcome, outcomeIndex) => (
        <div key={outcomeIndex} className="outcome">
          <div className="outcome__bar">
            <div
              className="outcome__bar--inner"
              style={{ width: `${outcome.value * 100}%`, backgroundColor: colorScale(outcomeIndex) }}
            >
              {/*<div className="outcome__bar--value">{ `${Math.round(outcome.value * 100).toFixed(0)}%` }</div>*/}
              <div className="outcome__bar--label">{ outcome.label }</div>
            </div>
          </div>
        </div>
      ))}
    </div>)
  }

  renderScalarOutcomes(outcomes, resolved) {
    // todo: implement
  }

  @autobind
  renderMarket(market) {
    console.log(market)
    const timeUntilEvent = moment
      .duration(moment(market.eventDescription.resolutionDate)
      .diff())

    const isResolved = timeUntilEvent < 0

    // test
    const testVal = Math.random()
    const testOutcomes = [
      { value: testVal, label: 'Yes' },
      { value: 1 - testVal, label: 'No' },
    ]

    return (
      <button type="button" className={`market ${isResolved ? 'market--resolved' : ''}`} key={market.address} onClick={() => this.handleViewMarket(market)}>
        <div className="market__header">
          <h2 className="market__title">{ market.eventDescription.title }</h2>
          <div className="market__control">
            <Link to={`/markets/${market.address}/resolve`}>Resolve</Link>
          </div>
        </div>
        {this.renderCategoricalOutcomes(testOutcomes, isResolved)}
        <div className="market__info row">
          {isResolved ? (
            <div className="info__group col-md-3">
              <div className="info_field">
                <div className="info__field--icon icon icon--checkmark" />
                <div className="info__field--label">Resolved</div>
              </div>
            </div>
          ) : (
            <div className="info__group col-md-3">
              <div className="info__field">
                <div className="info__field--icon icon icon--countdown" />
                <div className="info__field--label">
                  {timeUntilEvent.format(RESOLUTION_TIME.RELATIVE_FORMAT)}
                </div>
              </div>
            </div>
          )}
          <div className="info__group col-md-3">
            <div className="info__field">
              <div className="info__field--icon icon icon--enddate" />
              <div className="info__field--label">
                {moment(market.resolutionDate).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
              </div>
            </div>
          </div>
          <div className="info__group col-md-3">
            <div className="info__field">
              <div className="info__field--icon icon icon--oracle" />
              <div className="info__field--label">
                {market.oracle.address}
              </div>
            </div>
          </div>
          <div className="info__group col-md-3">
            <div className="info__field">
              <div className="info__field--icon icon icon--currency" />
              <div className="info__field--label">
                {market.event.collateralToken}
              </div>
            </div>
          </div>
        </div>
      </button>
    )
  }

  renderMarkets() {
    const { markets } = this.props

    if (markets.length > 0) {
      return (
        <div className="marketList col-md-10">
          <div className="marketList__title">Showing {markets.length} of {markets.length}</div>
          <div className="marketListContainer">
            {markets.map(this.renderMarket)}
          </div>
        </div>
      )
    }
    return (
      <div className="marketList col-md-10">
        <div className="marketListContainer">
          <div className="market">No Markets available</div>
        </div>
      </div>
    )
  }

  renderMarketFilter() {
    const { handleSubmit } = this.props

    return (
      <div className="marketFilter col-md-2">
        <form onSubmit={handleSubmit}>
          <div className="marketFilter__group">
            <Field
              component={FormSelect}
              name="preset"
              label="Preset"
              labelClassName="marketFilter__label"
              className="marketFilter__input"
              defaultValue={'none'}
              values={{ none: 'None' }}
            />
          </div>
          <div className="marketFilter__group">
            <Field
              component={FormSelect}
              name="oracle"
              label="Oracle"
              labelClassName="marketFilter__label"
              className="marketFilter__input"
              defaultValue={'CENTRALIZED'}
              values={{ CENTRALIZED: 'Centralized', ULTIMATE: 'Ultimate' }}
            />
          </div>
        </form>
      </div>
    )
  }

  render() {
    const { markets } = this.props
    return (
      <div className="marketListPage">
        <div className="marketListPage__header">
          <div className="container">
            <h1>Marketoverview</h1>
          </div>
        </div>
        <div className="marketListPage__stats">
          <div className="container">
            <div className="row marketStats">
              <div className="col-md-3 marketStats__stat">
                <div className="marketStats__icon icon icon--market" />
                <span className="marketStats__value">{ markets.length }</span>
                <div className="marketStats__label">Open Markets</div>
              </div>
              <div className="col-md-3 marketStats__stat">
                <div className="marketStats__icon icon icon--market--countdown" />
                <span className="marketStats__value">{ markets.length }</span>
                <div className="marketStats__label">Closing Soon</div>
              </div>
              <div className="col-md-3 marketStats__stat">
                <div className="marketStats__icon icon icon--new" />
                <span className="marketStats__value">{ markets.length }</span>
                <div className="marketStats__label">New Markets</div>
              </div>
              <div className="col-md-3">
                <button type="button" onClick={this.handleCreateMarket} className="marketStats__control btn btn-primary">Create Market</button>
              </div>
            </div>
          </div>
        </div>
        <div className="marketListPage__markets">
          <div className="container">
            <div className="row">
              { this.renderMarkets() }
              { this.renderMarketFilter() }
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'marketListFilter',
  onChange: (values, dispatch) => {
    dispatch(submit('marketListFilter'))
  },
  onSubmit: () => {
  },
})(MarketList)

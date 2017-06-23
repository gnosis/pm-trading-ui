import React, { Component } from 'react'
import { Link } from 'react-router'
import autobind from 'autobind-decorator'
import { schemeDark2 } from 'd3-scale-chromatic'
import { scaleOrdinal } from 'd3'
import moment from 'moment'
import 'moment-duration-format'
import { reduxForm, submit, Field } from 'redux-form'

import SelectLabeled from 'components/SelectLabeled'

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
              <div className="outcome__bar--value">{ `${Math.round(outcome.value * 100).toFixed(0)}%` }</div>
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
    const timeUntilEvent = moment
      .duration(moment(market.resolutionDate)
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
          <h1 className="market__title">{ market.title }</h1>
          <div className="market__control">
            <Link to={`/markets/${market.address}/resolve`}>Resolve</Link>
          </div>
        </div>
        {this.renderCategoricalOutcomes(testOutcomes, isResolved)}
        <div className="market__info row">
          {isResolved ? (
            <div className="info__group col-xs-3">
              <div className="info_field">
                <div className="info__field--icon icon icon--checkmark" />
                <div className="info__field--label">Resolved</div>
              </div>
            </div>
          ) : (
            <div className="info__group col-xs-3">
              <div className="info__field">
                <div className="info__field--icon icon icon--countdown" />
                <div className="info__field--label">
                  {timeUntilEvent.format(RESOLUTION_TIME.RELATIVE_FORMAT)}
                </div>
              </div>
            </div>
          )}
          <div className="info__group col-xs-3">
            <div className="info__field">
              <div className="info__field--icon icon icon--enddate" />
              <div className="info__field--label">
                {moment(market.resolutionDate).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
              </div>
            </div>
          </div>
          <div className="info__group col-xs-3">
            <div className="info__field">
              <div className="info__field--icon icon icon--oracle" />
              <div className="info__field--label">
                {market.oracleAddress}
              </div>
            </div>
          </div>
          <div className="info__group col-xs-3">
            <div className="info__field">
              <div className="info__field--icon icon icon--currency" />
              <div className="info__field--label">
                {market.collateralToken}
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
        <div className="marketList col-xs-10">
          <div className="marketList__title">Showing {markets.length} of {markets.length}</div>
          <div className="marketListContainer">
            {markets.map(this.renderMarket)}
          </div>
        </div>
      )
    }
    return (
      <div className="marketList col-xs-10">
        <div className="marketListContainer">
          <div className="market">No Markets available</div>
        </div>
      </div>
    )
  }

  renderMarketFilter() {
    const { handleSubmit } = this.props

    return (
      <div className="marketFilter col-xs-2">
        <form onSubmit={handleSubmit}>
          <div className="marketFilter__group">
            <Field
              component={SelectLabeled}
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
              component={SelectLabeled}
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
            <div className="row">
              <div className="col-xs-3 marketStats__stat">
                <span className="marketStats__value">{ markets.length }</span>
                <div className="marketStats__label">Open Markets</div>
              </div>
              <div className="col-xs-3 marketStats__stat">
                <span className="marketStats__value">{ markets.length }</span>
                <div className="marketStats__label">Closing Soon</div>
              </div>
              <div className="col-xs-3 marketStats__stat">
                <span className="marketStats__value">{ markets.length }</span>
                <div className="marketStats__label">New Markets</div>
              </div>
              <div className="col-xs-3">
                <button type="button" className="marketStats__control btn btn-primary">Create Market</button>
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

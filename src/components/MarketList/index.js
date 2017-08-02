import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import { calcLMSRMarginalPrice } from 'api'
import moment from 'moment'
import Decimal from 'decimal.js'
import 'moment-duration-format'
import { reduxForm, submit, Field } from 'redux-form'

import CurrencyName from 'components/CurrencyName'
import DecimalValue from 'components/DecimalValue'
import Countdown from 'components/Countdown'

import FormSelect from 'components/FormSelect'
import FormInput from 'components/FormInput'

import { RESOLUTION_TIME, OUTCOME_TYPES, COLOR_SCHEME_DEFAULT } from 'utils/constants'

import './marketList.less'

class MarketList extends Component {
  componentWillMount() {
    this.props.fetchMarkets()
  }

  @autobind
  handleViewMarket(market) {
    this.props.changeUrl(`/markets/${market.address}`)
  }

  @autobind
  handleViewMarketResolve(event, resolveUrl) {
    event.preventDefault()
    event.stopPropagation()

    this.props.changeUrl(resolveUrl)
  }

  @autobind
  handleCreateMarket() {
    this.props.changeUrl('/markets/new')
  }

  renderCategoricalOutcomes(market) {
    const renderOutcomes = market.eventDescription.outcomes
    const tokenDistribution = renderOutcomes.map((outcome, outcomeIndex) => {
      const marginalPrice = calcLMSRMarginalPrice({
        netOutcomeTokensSold: market.netOutcomeTokensSold,
        funding: market.funding,
        outcomeTokenIndex: outcomeIndex,
      })

      return marginalPrice.toFixed()
    })

    return (<div className="market__outcomes market-outcomes--categorical">
      {renderOutcomes.map((outcome, outcomeIndex) => (
        <div key={outcomeIndex} className="outcome">
          <div className="outcome__bar">
            <div
              className="outcome__bar--inner"
              style={{ width: `${tokenDistribution[outcomeIndex] * 100}%`, backgroundColor: COLOR_SCHEME_DEFAULT[outcomeIndex] }}
            >
              <div className="outcome__bar--label">
                { renderOutcomes[outcomeIndex] }
                <div className="outcome__bar--value">{ `${Math.round(tokenDistribution[outcomeIndex] * 100).toFixed(0)}%` }</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>)
  }

  renderScalarOutcomes(market) {
    const marginalPrice = calcLMSRMarginalPrice({
      netOutcomeTokensSold: market.netOutcomeTokensSold,
      // This is a temporary fix to avoid NaN when there is no funding, which should never occour
      funding: Decimal(parseInt(market.funding, 10) || 1e18),
      outcomeTokenIndex: 1, // always calc for long when calculating estimation
    })

    const decimals = parseInt(market.eventDescription.decimals, 10)

    const upperBound = Decimal(market.event.upperBound).div(10 ** decimals)
    const lowerBound = Decimal(market.event.lowerBound).div(10 ** decimals)

    const bounds = upperBound.sub(lowerBound)
    const value = Decimal(marginalPrice.toString()).times(bounds).add(lowerBound)

    return (
      <div className="market__outcomes market__outcomes--scalar">
        <div className="outcome outcome--scalar">
          <div className="outcome__bound outcome__bound--lower"><DecimalValue value={lowerBound} decimals={1} /></div>
          <div className="outcome__currentPrediction">
            <div className="outcome__currentPrediction--line" />
            <div className="outcome__currentPrediction--value" style={{ left: `${marginalPrice.mul(100).toFixed(5)}%` }}>{value.toString()}</div>
          </div>
          <div className="outcome__bound outcome__bound--upper"><DecimalValue value={upperBound} decimals={1} /></div>
        </div>
      </div>
    )
  }

  @autobind
  renderMarket(market) {
    const isResolved = market.oracle && market.oracle.isOutcomeSet
    const isOwner = market.creator === this.props.defaultAccount

    const resolveUrl = `/markets/${market.address}/resolve`

    const outcomes = market.event.type === OUTCOME_TYPES.SCALAR ?
      this.renderScalarOutcomes(market) :
      this.renderCategoricalOutcomes(market)


    return (
      <button type="button" className={`market ${isResolved ? 'market--resolved' : ''}`} key={market.address} onClick={() => this.handleViewMarket(market)}>
        <div className="market__header">
          <h2 className="market__title">{ market.eventDescription.title }</h2>
          {isOwner && !isResolved &&
            <div className="market__control">
              <a href={`/#${resolveUrl}`} onClick={e => this.handleViewMarketResolve(e, resolveUrl)}>Resolve</a>
            </div>}
        </div>
        {outcomes}
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
                  <Countdown target={market.eventDescription.resolutionDate} format={RESOLUTION_TIME.RELATIVE_FORMAT} />
                </div>
              </div>
            </div>
          )}
          <div className="info__group col-md-3">
            <div className="info__field">
              <div className="info__field--icon icon icon--enddate" />
              <div className="info__field--label">
                {moment(market.eventDescription.resolutionDate).format(RESOLUTION_TIME.ABSOLUTE_FORMAT)}
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
                <CurrencyName collateralToken={market.event.collateralToken} />
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
              component={FormInput}
              name="search"
              label="Search"
              placeholder="Title, Description"
              className="marketFilterField marketFilterSearch"
            />
          </div>
          <div className="marketFilter__group">
            <Field
              component={FormSelect}
              name="resolved"
              label="Show Resolved"
              className="marketFilterField marketFilterResolved"
              defaultValue={''}
              values={{ '': 'Both', RESOLVED: 'Show only resolved Markets', UNRESOLVED: 'Show only unresolved Markets' }}
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

MarketList.propTypes = {
  markets: PropTypes.arrayOf(PropTypes.object),
  defaultAccount: PropTypes.string,
  requestMarkets: PropTypes.func,
  connectBlockchain: PropTypes.func,
  changeUrl: PropTypes.func,
  handleSubmit: PropTypes.func,
}

export default reduxForm({
  form: 'marketListFilter',
})(MarketList)

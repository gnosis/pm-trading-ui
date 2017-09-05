import React, { Component, PropTypes } from 'react'
import { Field, reduxForm, propTypes } from 'redux-form'
import Decimal from 'decimal.js'
import autobind from 'autobind-decorator'

import { calcLMSROutcomeTokenCount, calcLMSRMarginalPrice } from 'api'

import { COLOR_SCHEME_DEFAULT, OUTCOME_TYPES } from 'utils/constants'
import { marketShape } from 'utils/shapes'

import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import ScalarSlider from 'components/ScalarSlider'

import FormRadioButton from 'components/FormRadioButton'
import Input from 'components/FormInput'
import Checkbox from 'components/FormCheckbox'

import './marketBuySharesForm.less'

class MarketBuySharesForm extends Component {
  getOutcomeTokenCount(investment, outcomeIndex) {
    if (!investment || !(parseFloat(investment) > 0)) {
      return new Decimal(0)
    }

    const invest = new Decimal(investment).mul(1e18)
    const {
      market: {
        funding,
        netOutcomeTokensSold,
        fee,
      },
    } = this.props

    let outcomeTokenCount
    try {
      outcomeTokenCount = calcLMSROutcomeTokenCount({
        feeFactor: fee,
        netOutcomeTokensSold,
        funding,
        outcomeTokenIndex: parseInt(outcomeIndex, 10),
        cost: invest.toString(),
      })
    } catch (e) {
      return new Decimal(0)
    }

    return outcomeTokenCount
  }

  getOutcomeIndex({ eventType }) {
    let outcomeIndex
    if (eventType === OUTCOME_TYPES.CATEGORICAL) {
      outcomeIndex = this.props.selectedCategoricalOutcome
    } else if (eventType === OUTCOME_TYPES.SCALAR) {
      outcomeIndex = 0 // short
    }
    return outcomeIndex
  }

  getMaximumWin(outcomeTokenCount) {
    return outcomeTokenCount.div(1e18)
  }

  getPercentageWin(outcomeTokenCount, investment) {
    if (!investment || !(parseFloat(investment) > 0)) {
      return '0'
    }

    const invest = new Decimal(investment).mul(1e18)
    return outcomeTokenCount.div(invest.toString()).mul(100).sub(100)
  }

  @autobind
  handleBuyShares() {
    const {
      market,
      buyShares,
      selectedBuyInvest,
      reset,
      defaultAccount,
    } = this.props
    // TODO this calculation could be avoided by passing it to the handleSubmit function
    const outcomeIndex = this.getOutcomeIndex({ eventType: market.event.type })
    const outcomeTokenCount = this.getOutcomeTokenCount(selectedBuyInvest, outcomeIndex)

    return buyShares(market, outcomeIndex, outcomeTokenCount, selectedBuyInvest)
      .then(() => {
        // Fetch new trades
        this.props.fetchMarketTrades(market)
        // Fetch new market participant trades
        this.props.fetchMarketParticipantTrades(market.address, defaultAccount)
        return reset()
      })
  }

  renderOutcomes() {
    const { market: { event } } = this.props

    if (event.type === OUTCOME_TYPES.CATEGORICAL) {
      return this.renderCategorical()
    }

    if (event.type === OUTCOME_TYPES.SCALAR) {
      return this.renderScalar()
    }

    return (
      <div className="col-md-6">
        <span>Invalid Outcomes...</span>
      </div>
    )
  }

  renderCategorical() {
    const { market: { eventDescription } } = this.props

    return (
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-12">
            <h2 className="marketBuyHeading">Preview & Setting</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Field
              component={FormRadioButton}
              name="selectedOutcome"
              className="marketBuyOutcome"
              radioValues={eventDescription.outcomes.map((label, index) => ({
                value: index,
                label: eventDescription.outcomes[index],
                highlightColor: COLOR_SCHEME_DEFAULT[index],
              }))}
            />
          </div>
        </div>
      </div>
    )
  }

  renderScalar() {
    const {
      selectedBuyInvest,
      market: {
        event: {
          lowerBound,
          upperBound,
        },
        eventDescription: {
          decimals,
          unit,
        },
        netOutcomeTokensSold,
        funding,
      },
    } = this.props

    const outcomeTokenCount = this.getOutcomeTokenCount(selectedBuyInvest, 1)
    const marginalPrice = calcLMSRMarginalPrice({
      netOutcomeTokensSold,
      funding,
      outcomeTokenIndex: 1,
    })

    // debugger
    return (
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-12">
            <h2 className="marketBuyHeading">Preview & Setting</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ScalarSlider
              lowerBound={parseInt(lowerBound, 10)}
              upperBound={parseInt(upperBound, 10)}
              unit={unit}
              decimals={decimals}
              marginalPriceCurrent={marginalPrice.toNumber()}
              marginalPriceSelected={marginalPrice.toNumber()}
              selectedCost={outcomeTokenCount}
            />
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      handleSubmit,
      selectedBuyInvest,
      isConfirmed,
      submitFailed,
      submitting,
      market: {
        event: {
          type: eventType,
          collateralToken,
        },
      },
    } = this.props

    const outcomeIndex = this.getOutcomeIndex({ eventType })

    const noOutcomeSelected = typeof outcomeIndex === 'undefined'

    const outcomeTokenCount = this.getOutcomeTokenCount(selectedBuyInvest, outcomeIndex)

    const maximumWin = this.getMaximumWin(outcomeTokenCount, selectedBuyInvest)
    const percentageWin = this.getPercentageWin(outcomeTokenCount, selectedBuyInvest)

    let submitEnabled = false
    let fieldError
    let tokenCountField
    let maxReturnField

    if (noOutcomeSelected) {
      fieldError = <span className="marketBuyWin__invalidParam">Select an outcome</span>
    } else if (Decimal(percentageWin.toString()).isZero()) {
      fieldError = <span className="marketBuyWin__invalidParam">Enter investment</span>
    } else if (Decimal(outcomeTokenCount.toString()).isZero()) {
      fieldError = <span className="marketBuyWin__invalidParam">Invalid investment</span>
    } else {
      tokenCountField = (
        <span className="marketBuyWin__row marketBuyWin__max">
          <DecimalValue value={maximumWin} />&nbsp;
          <div
            className={'marketBuyWin__outcomeColor'} style={{ backgroundColor: COLOR_SCHEME_DEFAULT[outcomeIndex] }}
          />&nbsp;
        </span>
      )

      maxReturnField = (
        <span className="marketBuyWin__row marketBuyWin__max">
          +<DecimalValue value={percentageWin} /> %&nbsp;
          <CurrencyName collateralToken={collateralToken} />
        </span>
      )

      submitEnabled = !Decimal(selectedBuyInvest).isZero()
    }

    return (
      <div className="marketBuySharesForm">
        <form onSubmit={handleSubmit(this.handleBuyShares)}>
          <div className="row">
            {this.renderOutcomes()}
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  <h2 className="marketBuyHeading">Bet Amount & Checkout</h2>
                </div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-8">
                  <Field name="invest" component={Input} className="marketBuyInvest" placeholder="Investment" />
                </div>
                <div className="col-md-4">
                  <div className="marketBuyCurrency">
                    <CurrencyName collateralToken={collateralToken} />
                  </div>
                </div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">
                    Token Count
                </div>
                <div className="col-md-6">{fieldError || tokenCountField}</div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">
                    Maximum return in %
                  </div>
                <div className="col-md-6">{fieldError || maxReturnField}</div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-12">
                  <Field name="confirm" component={Checkbox} className="marketBuyCheckbox" text="Confirm Purchase" />
                </div>
              </div>
              {submitFailed && (
                <div className="row marketBuySharesForm__row">
                  <div className="col-md-12">Sorry - your investment couldn't be processed. Please ensure you're on the right network.</div>
                </div>
              )}
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">
                  <button className={`btn btn-primary col-md-12 ${!isConfirmed || !submitEnabled ? 'disabled' : ''}`} disabled={!isConfirmed || !submitEnabled}>{submitting ? 'Loading...' : 'Buy Shares'}</button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-default col-md-12 marketBuySharesForm__cancel">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>)
  }
}

MarketBuySharesForm.propTypes = {
  ...propTypes,
  market: marketShape,
  buyShares: PropTypes.func,
  selectedCategoricalOutcome: PropTypes.number,
  selectedBuyInvest: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleSubmit: PropTypes.func,
  isConfirmed: PropTypes.bool,
}

const form = {
  form: 'marketBuyShares',
}

export default reduxForm(form)(MarketBuySharesForm)

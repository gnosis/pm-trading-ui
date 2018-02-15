import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm, propTypes } from 'redux-form'
import Decimal from 'decimal.js'
import autobind from 'autobind-decorator'

import { calcLMSROutcomeTokenCount, calcLMSRMarginalPrice } from 'api'

import { weiToEth } from 'utils/helpers'
import {
  COLOR_SCHEME_DEFAULT,
  COLOR_SCHEME_SCALAR,
  OUTCOME_TYPES,
  GAS_COST,
  LIMIT_MARGIN_DEFAULT,
} from 'utils/constants'
import { marketShape, marketShareShape } from 'utils/shapes'

import InteractionButton from 'containers/InteractionButton'

import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import ScalarSlider from 'components/ScalarSlider'

import FormRadioButton from 'components/FormRadioButton'
import FormBarChartRadioButton from 'components/FormBarChartRadioButton'
import Input from 'components/FormInput'

import './marketBuySharesForm.scss'

export const NUMBER_REGEXP = /^-?\d+\.?\d*$/

class MarketBuySharesForm extends Component {
  componentWillMount() {
    const {
      requestGasCost, requestGasPrice, isGasCostFetched, isGasPriceFetched,
    } = this.props
    if (!isGasCostFetched(GAS_COST.BUY_SHARES)) {
      requestGasCost(GAS_COST.BUY_SHARES)
    }
    if (!isGasPriceFetched) {
      requestGasPrice()
    }
  }

  getOutcomeTokenCount(investment, outcomeIndex, limitMargin) {
    const validInvestment = investment && NUMBER_REGEXP.test(investment) && parseFloat(investment) > 0
    if (!validInvestment) {
      return new Decimal(0)
    }

    const invest = new Decimal(investment)
      .mul(1e18)
      .div(new Decimal(100).add(limitMargin == null ? LIMIT_MARGIN_DEFAULT : limitMargin))
      .mul(100)
      .round()
    const { market: { funding, netOutcomeTokensSold, fee } } = this.props

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
      console.error(e)
      return new Decimal(0)
    }

    return outcomeTokenCount
  }

  getMaximumWin(outcomeTokenCount, investment) {
    if (NUMBER_REGEXP.test(investment)) {
      return outcomeTokenCount.sub(new Decimal(investment).mul(1e18)).div(1e18)
    }
    return '--'
  }

  getPercentageWin = (outcomeTokenCount, investment) => {
    const validInvestment = NUMBER_REGEXP.test(investment)
    if (!validInvestment) {
      return '0'
    }

    const invest = new Decimal(investment).mul(1e18)
    return outcomeTokenCount
      .div(invest.toString())
      .mul(100)
      .sub(100)
  }

  @autobind
  handleBuyShares() {
    const {
      market, buyShares, selectedBuyInvest, reset, defaultAccount, selectedOutcome, limitMargin,
    } = this.props

    const outcomeTokenCount = this.getOutcomeTokenCount(selectedBuyInvest, selectedOutcome, limitMargin)

    return buyShares(market, selectedOutcome, outcomeTokenCount, selectedBuyInvest)
      .then(() => {
        // Fetch new trades
        this.props.fetchMarketTrades(market)
        // Fetch new market participant trades
        this.props.fetchMarketTradesForAccount(market.address, defaultAccount)
        // Fetch new shares
        this.props.fetchMarketShares(defaultAccount)
        return reset()
      })
      .catch(e => console.error(e))
  }

  // redux-form validate field function. Return undefined if it is ok or a string with an error.
  validateInvestment = (investmentValue) => {
    const { currentBalance = 0 } = this.props
    // check if investment is not undefined and test it against number regexp to prevent errors from decimal.js
    if (!investmentValue) {
      return false
    }

    const validInvestment = NUMBER_REGEXP.test(investmentValue)
    if (!validInvestment) {
      return 'Invalid amount'
    }

    const decimalValue = Decimal(investmentValue)
    if (decimalValue.lte(0)) {
      return "Number can't be negative or equal to zero."
    }

    if (decimalValue.gt(currentBalance)) {
      return "You're trying to invest more than you have."
    }

    return undefined
  }

  renderCategorical() {
    const {
      selectedBuyInvest, selectedOutcome, limitMargin, market, market: { eventDescription },
    } = this.props

    const outcomeTokenCount = this.getOutcomeTokenCount(selectedBuyInvest, selectedOutcome, limitMargin)

    return (
      <div className="col-md-7">
        <div className="row">
          <div className="col-md-12">
            <h2 className="marketBuyHeading">Your Trade</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Field
              component={FormBarChartRadioButton}
              name="selectedOutcome"
              className="marketBuyOutcome"
              market={market}
              selectedOutcome={selectedOutcome}
              outcomeTokenCount={outcomeTokenCount}
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

  renderScalar() {
    const {
      selectedBuyInvest,
      selectedOutcome,
      market: {
        event: { lowerBound, upperBound },
        eventDescription: { decimals, unit },
        netOutcomeTokensSold,
        funding,
        marginalPrices,
      },
    } = this.props

    const validInvestment = NUMBER_REGEXP.test(selectedBuyInvest) || !selectedBuyInvest
    const isOutcomeSelected = selectedOutcome !== undefined
    const currentMarginalPrice = marginalPrices[1]
    // Get the amount of tokens to buy
    const outcomeTokenCount = this.getOutcomeTokenCount(selectedBuyInvest, selectedOutcome)
    const newNetOutcomeTokenSold = netOutcomeTokensSold.slice()
    if (isOutcomeSelected) {
      newNetOutcomeTokenSold[selectedOutcome] = new Decimal(newNetOutcomeTokenSold[selectedOutcome])
        .add(outcomeTokenCount.toString())
        .toString()
    }
    const selectedMarginalPrice =
      isOutcomeSelected && validInvestment
        ? calcLMSRMarginalPrice({
          netOutcomeTokensSold: newNetOutcomeTokenSold,
          funding,
          outcomeTokenIndex: 1,
        })
        : new Decimal('0')

    const scalarOutcomes = [
      {
        value: 0,
        label: 'Short',
        highlightColor: COLOR_SCHEME_SCALAR[0],
      },
      {
        value: 1,
        label: 'Long',
        highlightColor: COLOR_SCHEME_SCALAR[1],
      },
    ]

    return (
      <div className="col-md-6">
        <div className="row">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <h2 className="marketBuyHeading">Your Trade</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Field
                  component={FormRadioButton}
                  name="selectedOutcome"
                  className="marketBuyOutcome"
                  radioValues={scalarOutcomes}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <ScalarSlider
              lowerBound={parseInt(lowerBound, 10)}
              upperBound={parseInt(upperBound, 10)}
              unit={unit}
              decimals={decimals}
              marginalPriceCurrent={currentMarginalPrice}
              marginalPriceSelected={selectedMarginalPrice.toNumber()}
              selectedCost={outcomeTokenCount}
            />
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      gasCosts,
      gasPrice,
      invalid,
      handleSubmit,
      market: { event: { collateralToken, type }, local },
      selectedBuyInvest,
      submitFailed,
      submitting,
      limitMargin,
      selectedOutcome,
    } = this.props

    const noOutcomeSelected = typeof selectedOutcome === 'undefined'
    // Get the amount of tokens to buy
    const outcomeTokenCount = this.getOutcomeTokenCount(selectedBuyInvest, selectedOutcome, limitMargin)
    const maximumWin = this.getMaximumWin(outcomeTokenCount, selectedBuyInvest || '0')
    const percentageWin = this.getPercentageWin(outcomeTokenCount, selectedBuyInvest)
    const gasCostEstimation = weiToEth(gasPrice.mul(gasCosts.buyShares || 0))

    const submitDisabled = invalid || !selectedBuyInvest
    let fieldError
    let tokenCountField
    let maxReturnField

    if (noOutcomeSelected) {
      fieldError = <span className="marketBuyWin__invalidParam">--</span>
    } else if (Decimal(percentageWin.toString()).isZero()) {
      fieldError = <span className="marketBuyWin__invalidParam">--</span>
    } else if (Decimal(outcomeTokenCount.toString()).isZero()) {
      fieldError = <span className="marketBuyWin__invalidParam">Invalid investment</span>
    } else {
      const colorSource = type === OUTCOME_TYPES.CATEGORICAL ? COLOR_SCHEME_DEFAULT : COLOR_SCHEME_SCALAR
      const outcomeColorStyles = {
        backgroundColor: colorSource[selectedOutcome],
      }

      tokenCountField = (
        <span className="marketBuyWin__row marketBuyWin__max">
          <DecimalValue value={weiToEth(outcomeTokenCount)} />&nbsp;
          <div className="marketBuyWin__outcomeColor" style={outcomeColorStyles} />&nbsp;
        </span>
      )

      const returnSign = maximumWin > 0 ? '' : '+'
      maxReturnField = (
        <span className="marketBuyWin__row marketBuyWin__max">
          {returnSign}
          <DecimalValue value={percentageWin} /> %&nbsp; (<DecimalValue value={maximumWin} />&nbsp;
          <CurrencyName collateralToken={collateralToken} />)
        </span>
      )
    }

    return (
      <div className="marketBuySharesForm">
        <form onSubmit={handleSubmit(this.handleBuyShares)}>
          <div className="row">
            {this.renderOutcomes()}
            <div className="col-md-5">
              <div className="row marketBuySharesForm__row">
                <div className="col-md-8">
                  <Field
                    name="invest"
                    component={Input}
                    className="marketBuyInvest"
                    placeholder="Investment"
                    validate={this.validateInvestment}
                  />
                </div>
                <div className="col-md-4">
                  <div className="marketBuyCurrency">
                    <CurrencyName collateralToken={collateralToken} />
                  </div>
                </div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">Token Count</div>
                <div className="col-md-6">{fieldError || tokenCountField}</div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">Maximum return</div>
                <div className="col-md-6">{fieldError || maxReturnField}</div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-6">Gas Costs</div>
                <div className="col-md-6">
                  <DecimalValue value={gasCostEstimation} decimals={4} />
                  {' ETH'}
                </div>
              </div>
              <div className="row marketBuySharesForm__row">
                <div className="col-md-12 text-center">
                  <span>
                    The actual cost you will pay might be less by 5% depending on the market price at the time of
                    trading
                  </span>
                </div>
              </div>
              {submitFailed && (
                <div className="row marketBuySharesForm__row">
                  <div className="col-md-12">
                    Sorry - your investment couldn&apos;t be processed. Please ensure you&apos;re on the right network.
                  </div>
                </div>
              )}
              <div className="row marketBuySharesForm__row">
                <div className="col-xs-10 col-xs-offset-1">
                  <InteractionButton
                    className="btn btn-primary col-xs-12"
                    disabled={submitDisabled}
                    loading={submitting || local}
                    type="submit"
                  >
                    Buy Tokens
                  </InteractionButton>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

MarketBuySharesForm.propTypes = {
  ...propTypes,
  market: marketShape,
  buyShares: PropTypes.func,
  marketShares: PropTypes.objectOf(marketShareShape),
  selectedOutcome: PropTypes.number,
  selectedBuyInvest: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleSubmit: PropTypes.func,
  submitEnabled: PropTypes.bool,
  currentBalance: PropTypes.string,
}

const form = {
  form: 'marketBuyShares',
}

export default reduxForm(form)(MarketBuySharesForm)

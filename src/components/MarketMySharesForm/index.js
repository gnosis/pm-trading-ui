import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field, propTypes } from 'redux-form'
import autobind from 'autobind-decorator'
import Decimal from 'decimal.js'
import { calcLMSRMarginalPrice, calcLMSRProfit } from 'api'

import InteractionButton from 'containers/InteractionButton'

import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'

import { NUMBER_REGEXP } from 'components/MarketBuySharesForm'
import Hairline from 'components/layout/Hairline'

import { TextInput, Slider } from 'components/Form'

import {
  COLOR_SCHEME_DEFAULT,
  COLOR_SCHEME_SCALAR,
  GAS_COST,
  LOWEST_DISPLAYED_VALUE,
  MIN_CONSIDER_VALUE,
  LIMIT_MARGIN_DEFAULT,
  OUTCOME_TYPES,
} from 'utils/constants'

import { getOutcomeName, weiToEth, normalizeScalarPoint, isMarketClosed, isMarketResolved } from 'utils/helpers'
import { marketShape } from 'utils/shapes'

import './marketMySharesForm.scss'

export const MY_TOKENS = 'My Tokens'

class MarketMySharesForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      extendedSellId: undefined,
    }
  }

  componentWillMount() {
    const {
      gasCosts, gasPrice, requestGasCost, requestGasPrice,
    } = this.props

    if (gasCosts.get('sellShares') === undefined) {
      requestGasCost(GAS_COST.SELL_SHARES)
    }
    if (gasPrice === undefined) {
      requestGasPrice()
    }

    if (this.props.match.params.shareId) {
      this.setState({
        extendedSellId: this.props.match.params.shareId,
      })
    }

    if (this.props.defaultAccount) {
      this.props.fetchMarketShares(this.props.defaultAccount)
    }
  }

  componentDidUpdate() {
    const { extendedSellId } = this.state
    const { selectedSellAmount, marketShares, initialize } = this.props
    const sellAmountAndMarketSharesAreDefined =
      selectedSellAmount === undefined && extendedSellId !== undefined && Object.keys(marketShares).length

    if (sellAmountAndMarketSharesAreDefined) {
      // By default form is filled up with fill amount
      const share = marketShares[extendedSellId]

      if (share) {
        const fullAmount = Decimal(share.balance)
          .div(1e18)
          .toDP(4, 1)
          .toString()
        initialize({ sellAmount: fullAmount })
      }
    }
  }

  @autobind
  handleShowSellView(e, shareId) {
    const { initialize } = this.props
    e.preventDefault()
    this.props.reset()
    // Form reset / reinitialization when switching among shares
    initialize({
      limitMargin: LIMIT_MARGIN_DEFAULT,
    })
    this.setState({ extendedSellId: shareId === this.state.extendedSellId ? undefined : shareId })
  }

  @autobind
  handleCloseSellView(e) {
    e.preventDefault()
    this.props.reset()
    this.setState({ extendedSellId: undefined })
  }

  @autobind
  async handleSellShare(shareId, shareAmount, earnings) {
    const share = this.props.marketShares[shareId]
    const shareBalance = new Decimal(share.balance)
    const shareBalanceRounded = shareBalance.div(1e18).toDP(4, 1)
    const selectedSellAmount = new Decimal(shareAmount)
    const sellAmount = shareBalanceRounded.sub(selectedSellAmount).lt(MIN_CONSIDER_VALUE)
      ? weiToEth(shareBalance)
      : shareAmount
    try {
      await this.props.sellShares(this.props.market, share, sellAmount, earnings)
      this.setState({ extendedSellId: undefined })
    } catch (e) {
      console.error(e)
    }
    return this.props.reset()
  }

  @autobind
  validateTokenCount(val, values, props) {
    const share = props.marketShares[this.state.extendedSellId]
    if (!val || !NUMBER_REGEXP.test(val)) {
      return 'Invalid amount'
    }

    const decimalValue = Decimal(val)
    if (decimalValue.lt(0)) {
      return "Number can't be negative."
    }

    if (decimalValue.gt(Decimal(share.balance).div(1e18))) {
      return "You're trying to sell more than you invested."
    }

    return undefined
  }

  generateTableRows() {
    const tableRows = []

    const { marketShares, market } = this.props
    const { extendedSellId } = this.state

    const resolvedOrClosed = isMarketClosed(market) || isMarketResolved(market)

    Object.keys(marketShares).forEach((shareId) => {
      const share = marketShares[shareId]
      const colorScheme = share.event.type === OUTCOME_TYPES.SCALAR ? COLOR_SCHEME_SCALAR : COLOR_SCHEME_DEFAULT
      const outcomeColorStyle = { backgroundColor: colorScheme[share.outcomeToken.index] }

      tableRows.push(<tr className="marketMyShares__share" key={share.id}>
        <td>
          <div className="shareOutcome__color" style={outcomeColorStyle} />
        </td>
        <td className="">{getOutcomeName(market, share.outcomeToken.index)}</td>
        <td>
          {Decimal(share.balance)
            .div(1e18)
            .gte(LOWEST_DISPLAYED_VALUE) ? (
              <DecimalValue value={Decimal(share.balance).div(1e18)} />
            ) : (
              `< ${LOWEST_DISPLAYED_VALUE}`
            )}
        </td>
        <td>
          {!resolvedOrClosed && (
            <a
              href="javascript:void(0);"
              className="marketMyShares__sellButton"
              onClick={e => this.handleShowSellView(e, share.id)}
            >
                Sell
            </a>
          )}
        </td>
      </tr>)

      if (share.id === extendedSellId) {
        tableRows.push(<tr className="marketMyShares__sellView" key={`${share.id}__sell`}>
          <td colSpan={5}>{this.renderSellShareView()}</td>
        </tr>)
      }
    })

    return tableRows
  }

  renderSellShareView() {
    const { extendedSellId } = this.state
    const {
      market,
      invalid,
      submitting,
      submitFailed,
      selectedSellAmount,
      handleSubmit,
      marketShares,
      gasCosts,
      gasPrice,
    } = this.props

    const share = marketShares[extendedSellId]
    let newScalarPredictedValue // calculated only for scalar events
    let selectedSellAmountWei
    try {
      selectedSellAmountWei = new Decimal(parseFloat(selectedSellAmount) || 0).mul(1e18).toString()
    } catch (e) {
      selectedSellAmountWei = '0'
    }

    let currentProbability
    if (market.event.type === 'CATEGORICAL') {
      try {
        currentProbability = calcLMSRMarginalPrice({
          netOutcomeTokensSold: market.netOutcomeTokensSold.slice(),
          funding: market.funding,
          outcomeTokenIndex: share.outcomeToken.index,
        })
      } catch (e) {
        currentProbability = new Decimal(0)
      }
    } else {
      // Scalar
      try {
        currentProbability = calcLMSRMarginalPrice({
          netOutcomeTokensSold: market.netOutcomeTokensSold.slice(),
          funding: market.funding,
          outcomeTokenIndex: 1,
        })
      } catch (e) {
        currentProbability = new Decimal(0)
      }
    }

    const currentTokenBalance = share && share.balance ? new Decimal(share.balance) : new Decimal(0)
    const newTokenBalance = currentTokenBalance.sub(selectedSellAmountWei)

    let earnings = new Decimal(0)
    if (share.balance && NUMBER_REGEXP.test(selectedSellAmount) && parseFloat(selectedSellAmount) > 0) {
      earnings = weiToEth(calcLMSRProfit({
        netOutcomeTokensSold: market.netOutcomeTokensSold.slice(),
        funding: market.funding,
        outcomeTokenIndex: share.outcomeToken.index,
        outcomeTokenCount: selectedSellAmountWei,
        feeFactor: market.fee,
      })
        .mul(new Decimal(100).sub(LIMIT_MARGIN_DEFAULT))
        .div(100))
    }

    const newNetOutcomeTokensSold = market.netOutcomeTokensSold.map((outcomeTokenAmount, outcomeTokenIndex) => {
      if (outcomeTokenIndex === share.outcomeToken.index && !currentTokenBalance.sub(newTokenBalance).isZero()) {
        return Decimal(outcomeTokenAmount)
          .sub(currentTokenBalance.sub(newTokenBalance))
          .floor()
          .toString()
      }

      return Decimal(outcomeTokenAmount).toString()
    })

    let newProbability
    if (market.event.type === 'SCALAR') {
      try {
        newProbability = calcLMSRMarginalPrice({
          netOutcomeTokensSold: newNetOutcomeTokensSold,
          funding: market.funding,
          outcomeTokenIndex: 1, // long
        })
      } catch (e) {
        newProbability = currentProbability
      }
      const newMarginalPrices = [new Decimal(1).sub(newProbability), newProbability]
      newScalarPredictedValue = normalizeScalarPoint(newMarginalPrices, market)
    } else {
      // Categorical events
      try {
        newProbability = calcLMSRMarginalPrice({
          netOutcomeTokensSold: newNetOutcomeTokensSold,
          funding: market.funding,
          outcomeTokenIndex: share.outcomeToken.index,
        })
      } catch (e) {
        newProbability = currentProbability
      }
    }

    if (market.event.type === 'SCALAR') {
      newScalarPredictedValue = normalizeScalarPoint(market.marginalPrices, market)
    }

    const submitDisabled = invalid || submitting
    const sellSharesGasCost = gasCosts.get('sellShares')
    const gasCostEstimation = weiToEth(gasPrice.mul(sellSharesGasCost))

    return (
      <div className="marketMyShares__sellContainer">
        <form onSubmit={handleSubmit(() => this.handleSellShare(extendedSellId, selectedSellAmount, earnings))}>
          <div className="row marketMyShares__sellRow">
            <div className="col-md-4 marketMyShares__sellColumn">
              <label htmlFor="sellAmount">Amount to Sell</label>
              <Field
                component={TextInput}
                name="sellAmount"
                placeholder="Enter Token Amount"
                className="marketMySharesSellAmount"
                validate={this.validateTokenCount}
              />
            </div>

            {market.event.type === 'SCALAR' ? (
              <div className="col-md-4 marketMyShares__sellColumn">
                <label>New predicted value</label>
                <span>
                  <DecimalValue value={newScalarPredictedValue} />&nbsp;
                  <span>{market.eventDescription.unit}</span>
                </span>
              </div>
            ) : (
              <div className="col-md-4 marketMyShares__sellColumn">
                <label>New Probability</label>
                <span>
                  <DecimalValue value={newProbability.mul(100)} /> %
                </span>
              </div>
            )}
            <div className="col-md-3 marketMyShares__sellColumn">
              <label>Gas costs</label>
              <span>
                <DecimalValue value={gasCostEstimation} decimals={5} />&nbsp;
                <CurrencyName collateralToken={market.event.collateralToken} />
              </span>
            </div>
          </div>
          <Hairline />
          <div className="row marketMyShares__sellRow">
            <div className="col-md-2 marketMyShares__sellColumn--limit">
              <label htmlFor="limitMargin">Limit Margin</label>
            </div>
            <div className="col-md-3">
              <Field
                name="limitMargin"
                component={Slider}
                className="limitMarginField"
                placeholder={LIMIT_MARGIN_DEFAULT}
                min={0}
                max={5}
                unit="%"
                step={0.5}
                showInput={false}
              />
            </div>
            <div className="col-md-4 marketMyShares__sellColumn">
              <div className="marketMyShares__sellColumn--info">
                <label>Earnings</label>
                <span>
                  <DecimalValue value={earnings} />&nbsp;
                  <CurrencyName collateralToken={market.event.collateralToken} />
                </span>
              </div>
              <InteractionButton
                loading={submitting || market.local}
                disabled={submitDisabled}
                className="btn btn-block btn-primary"
                type="submit"
              >
                Sell Tokens
              </InteractionButton>
            </div>
          </div>
          {submitFailed && (
            <div className="row">
              <div className="col-md-9 marketMyShares__errorColumn">
                Sorry - your share sell could not be processed. Please ensure you&apos;re on the right network.
              </div>
            </div>
          )}
        </form>
      </div>
    )
  }

  render() {
    const { marketShares } = this.props
    if (!marketShares || !Object.keys(marketShares).length) {
      return (
        <div className="marketMyShares">
          <h2 className="marketMyShares__heading">
            You don&apos;t hold any shares for this market.
            <br />
            <small>It may take some time for the blockchain to mine your share purchase.</small>
          </h2>
        </div>
      )
    }

    return (
      <div className="marketMyShares">
        <h2 className="marketMyShares__heading">{MY_TOKENS}</h2>
        <table className="table marketMyShares__shareTable">
          <thead>
            <tr>
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--index" />
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group">Outcome</th>
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group">Outcome Token Count</th>
              <th className="marketMyShares__tableHeading marketMyShares__tableHeading--group" />
            </tr>
          </thead>
          <tbody>{this.generateTableRows()}</tbody>
        </table>
      </div>
    )
  }
}

MarketMySharesForm.propTypes = {
  ...propTypes,
  market: marketShape,
  selectedSellAmount: PropTypes.string,
  limitMargin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  marketShares: PropTypes.arrayOf(PropTypes.object),
  sellShares: PropTypes.func,
}

const FORM = {
  form: 'marketMyShares',
}

export default reduxForm(FORM)(MarketMySharesForm)

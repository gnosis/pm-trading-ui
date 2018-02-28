import React, { Component } from 'react'
import Decimal from 'decimal.js'
import autobind from 'autobind-decorator'
import cn from 'classnames/bind'
import { reduxForm, propTypes, Field } from 'redux-form'
import InteractionButton from 'containers/InteractionButton'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import FormSlider from 'components/FormSlider'
import FormInput from 'components/FormInput'
import { NUMBER_REGEXP } from 'routes/MarketDetails/components/ExpandableViews/MarketBuySharesForm'
import Hairline from 'components/layout/Hairline'
import { LIMIT_MARGIN_DEFAULT, OUTCOME_TYPES } from 'utils/constants'
import web3 from 'web3'
import { weiToEth, normalizeScalarPoint } from 'utils/helpers'
import { calculateCurrentProbability, calculateEarnings, calculateNewProbability } from './utils'
import style from './ShareSellView.mod.scss'

const cx = cn.bind(style)

class ShareSellView extends Component {
  componentDidUpdate() {
    const { selectedSellAmount, share, initialize } = this.props
    const newShareSellOpened = selectedSellAmount === undefined && share.id !== undefined

    if (newShareSellOpened) {
      this.props.reset()
      // Form reset / reinitialization when switching among shares
      const fullAmount = Decimal(share.balance)
        .div(1e18)
        .toDP(4, 1)
        .toString()
      initialize({ sellAmount: fullAmount, limitMargin: LIMIT_MARGIN_DEFAULT })
    }
  }

  @autobind
  validateTokenCount(val) {
    const { share } = this.props
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

  render() {
    const {
      market,
      invalid,
      submitting,
      submitFailed,
      selectedSellAmount,
      handleSubmit,
      share,
      gasCosts,
      gasPrice,
    } = this.props

    const sellSharesGasCost = gasCosts.get('sellShares')
    const submitDisabled = invalid || submitting

    let selectedSellAmountWei
    try {
      selectedSellAmountWei = web3.utils.toWei(selectedSellAmount)
    } catch (e) {
      selectedSellAmountWei = '0'
    }

    const gasCostEstimation = weiToEth(gasPrice.mul(sellSharesGasCost))
    const currentProbability = calculateCurrentProbability(market, share)
    const currentTokenBalance = share && share.balance ? new Decimal(share.balance) : new Decimal(0)
    const newTokenBalance = currentTokenBalance.sub(selectedSellAmountWei)
    const earnings = calculateEarnings(market, share, selectedSellAmountWei)
    const submitHandler = handleSubmit(() => this.props.handleSellShare(share.id, selectedSellAmount, earnings))

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
    try {
      newProbability = calculateNewProbability(market, share, newNetOutcomeTokensSold)
    } catch (e) {
      newProbability = currentProbability
    }

    let newMarginalPrices
    let newScalarPredictedValue
    if (market.event.type === OUTCOME_TYPES.SCALAR) {
      newMarginalPrices = [new Decimal(1).sub(newProbability), newProbability]
      newScalarPredictedValue = normalizeScalarPoint(newMarginalPrices, market)
    }

    return (
      <tr className={cx('sellView')}>
        <td colSpan={5}>
          <div className={cx('sellViewContainer')}>
            <form onSubmit={submitHandler}>
              <div className={cx('row', 'sellRow')}>
                <div className="col-md-4 marketMyShares__sellColumn">
                  <label htmlFor="sellAmount">Amount to Sell</label>
                  <Field
                    component={FormInput}
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
                    component={FormSlider}
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
        </td>
      </tr>
    )
  }
}

ShareSellView.propTypes = {
  ...propTypes,
}

const FORM = {
  form: 'marketMyShares',
}

export default reduxForm(FORM)(ShareSellView)

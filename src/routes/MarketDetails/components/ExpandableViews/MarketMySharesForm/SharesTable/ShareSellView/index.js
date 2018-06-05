import React, { Component } from 'react'
import Decimal from 'decimal.js'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import web3 from 'web3'
import ImmutablePropTypes from 'react-immutable-proptypes'
import cn from 'classnames/bind'
import { reduxForm, propTypes, Field } from 'redux-form'
import { Map } from 'immutable'
import InteractionButton from 'containers/InteractionButton'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { Slider, TextInput } from 'components/Form'
import { NUMBER_REGEXP } from 'routes/MarketDetails/components/ExpandableViews/MarketBuySharesForm'
import Hairline from 'components/layout/Hairline'
import IndefiniteSpinner from 'components/Spinner/Indefinite'
import { marketShape, marketShareShape } from 'utils/shapes'
import { LIMIT_MARGIN, OUTCOME_TYPES, GAS_COST } from 'utils/constants'
import { weiToEth, normalizeScalarPoint } from 'utils/helpers'
import { calculateCurrentProbability, calculateEarnings, calculateNewProbability } from './utils'
import style from './ShareSellView.mod.scss'

const cx = cn.bind(style)

const inputErrorStyle = {
  whiteSpace: 'nowrap',
}

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
      initialize({ sellAmount: fullAmount, limitMargin: LIMIT_MARGIN })
    }
  }

  @autobind
  validateTokenCount(val) {
    const { share, market } = this.props
    if (!val || !NUMBER_REGEXP.test(val) || Decimal(val).lt(1e-18)) {
      return 'Invalid amount'
    }

    const decimalValue = Decimal(val)
    const earnings = calculateEarnings(market, share, web3.utils.toWei(val))

    if (decimalValue.lt(0)) {
      return "Number can't be negative."
    }

    if (decimalValue.gt(Decimal(share.balance).div(1e18))) {
      return "You're trying to sell more than you invested."
    }

    if (Decimal(0).eq(earnings)) {
      return 'This transaction is not permitted because it will result in a loss of an outcome token.'
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
      isGasPriceFetched,
      isGasCostFetched,
      valid,
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

    let newTokenBalance = currentTokenBalance
    let earnings = 0
    let newProbability = currentProbability
    let newNetOutcomeTokensSold = market.netOutcomeTokensSold
    let newMarginalPrices
    let newScalarPredictedValue

    if (market.event.type === OUTCOME_TYPES.SCALAR) {
      newMarginalPrices = [new Decimal(1).sub(currentProbability), newProbability]
      newScalarPredictedValue = normalizeScalarPoint(newMarginalPrices, market)
    }

    // Run the calculations only if the form is valid
    if (valid) {
      newTokenBalance = currentTokenBalance.sub(selectedSellAmountWei)
      earnings = calculateEarnings(market, share, selectedSellAmountWei)
      newNetOutcomeTokensSold = market.netOutcomeTokensSold.map((outcomeTokenAmount, outcomeTokenIndex) => {
        if (outcomeTokenIndex === share.outcomeToken.index && !currentTokenBalance.sub(newTokenBalance).isZero()) {
          return Decimal(outcomeTokenAmount)
            .sub(currentTokenBalance.sub(newTokenBalance))
            .floor()
            .toString()
        }

        return outcomeTokenAmount
      })

      try {
        newProbability = calculateNewProbability(market, share, newNetOutcomeTokensSold)
      } catch (e) {
        console.error(e)
      }

      if (market.event.type === OUTCOME_TYPES.SCALAR) {
        newMarginalPrices = [new Decimal(1).sub(newProbability), newProbability]
        newScalarPredictedValue = normalizeScalarPoint(newMarginalPrices, market)
      }
    }
    const submitHandler = handleSubmit(() => this.props.handleSellShare(share.id, selectedSellAmount, earnings))

    return (
      <tr className={cx('sellView')}>
        <td colSpan={5}>
          <div className={cx('sellViewContainer')}>
            <form onSubmit={submitHandler}>
              <div className={cx('row', 'sellRow')}>
                <div className={cx('col-md-4', 'sellColumn')}>
                  <label htmlFor="sellAmount">Amount to Sell</label>
                  <Field
                    component={TextInput}
                    name="sellAmount"
                    placeholder="Enter Token Amount"
                    className={cx('sharesSellAmount')}
                    validate={this.validateTokenCount}
                    errorStyle={inputErrorStyle}
                  />
                </div>

                {market.event.type === 'SCALAR' ? (
                  <div className={cx('col-md-4', 'sellColumn')}>
                    <label>New predicted value</label>
                    <span>
                      <DecimalValue value={newScalarPredictedValue} />&nbsp;
                      <span>{market.eventDescription.unit}</span>
                    </span>
                  </div>
                ) : (
                  <div className={cx('col-md-4', 'sellColumn')}>
                    <label>New Probability</label>
                    <span>
                      <DecimalValue value={newProbability.mul(100)} /> %
                    </span>
                  </div>
                )}
                <div className={cx('col-md-3', 'sellColumn')}>
                  <label>Gas costs</label>
                  <span>
                    {isGasPriceFetched && isGasCostFetched(GAS_COST.SELL_SHARES) ? (
                      <React.Fragment>
                        <DecimalValue value={gasCostEstimation} decimals={5} />&nbsp;
                        <CurrencyName tokenAddress={market.event.collateralToken} />
                      </React.Fragment>
                    ) : (
                      <IndefiniteSpinner width={16} height={16} />
                    )}
                  </span>
                </div>
              </div>
              <Hairline />
              <div className={cx('row', 'sellRow')}>
                <div className={cx('col-md-2')}>
                  <label htmlFor="limitMargin">Limit Margin</label>
                </div>
                <div className={cx('col-md-3')}>
                  <Field
                    name="limitMargin"
                    component={Slider}
                    className={cx('formSlider')}
                    placeholder={LIMIT_MARGIN}
                    min={0}
                    max={5}
                    unit="%"
                    step={0.5}
                    showInput={false}
                    light
                  />
                </div>
                <div className={cx('col-md-4', 'sellColumn')}>
                  <div className={cx('sellColumnInfo')}>
                    <label>Earnings</label>
                    <span>
                      <DecimalValue value={earnings} />&nbsp;
                      <CurrencyName tokenAddress={market.event.collateralToken} />
                    </span>
                  </div>
                  <InteractionButton
                    loading={submitting || market.local}
                    disabled={submitDisabled}
                    className={cx('btn', 'btn-block', 'btn-primary')}
                    type="submit"
                  >
                    Sell Tokens
                  </InteractionButton>
                </div>
              </div>
              {submitFailed && (
                <div className={cx('row')}>
                  <div className={cx('col-md-9', 'sellErrorField')}>
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
  isGasCostFetched: PropTypes.func.isRequired,
  gasCosts: ImmutablePropTypes.map,
  gasPrice: PropTypes.instanceOf(Decimal),
  isGasPriceFetched: PropTypes.bool,
  market: marketShape,
  selectedSellAmount: PropTypes.string,
  handleSellShare: PropTypes.func,
  share: marketShareShape,
}

ShareSellView.defaultProps = {
  market: {},
  gasCosts: Map({}),
  gasPrice: Decimal(0),
  selectedSellAmount: undefined,
  handleSellShare: () => {},
  share: {},
  isGasPriceFetched: false,
}

const FORM = {
  form: 'marketMyShares',
}

export default reduxForm(FORM)(ShareSellView)

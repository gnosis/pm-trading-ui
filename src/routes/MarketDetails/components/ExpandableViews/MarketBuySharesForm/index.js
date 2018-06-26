import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import { Field, reduxForm, propTypes } from 'redux-form'
import Decimal from 'decimal.js'
import autobind from 'autobind-decorator'
import { weiToEth } from 'utils/helpers'
import {
  COLOR_SCHEME_DEFAULT, COLOR_SCHEME_SCALAR, OUTCOME_TYPES, GAS_COST,
} from 'utils/constants'
import { marketShape, marketShareShape } from 'utils/shapes'
import InteractionButton from 'containers/InteractionButton'
import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'
import { TextInput, TextInputAdornment } from 'components/Form'
import IndefiniteSpinner from 'components/Spinner/Indefinite'
import {
  getOutcomeTokenCount, getMaximumWin, getPercentageWin, NUMBER_REGEXP,
} from './utils'
import OutcomeSection from './OutcomesSection'
import SubmitError from './SubmitError'
import LimitMarginAnnotation from './LimitMarginAnnotation'
import style from './marketBuySharesForm.mod.scss'

const cx = cn.bind(style)

class MarketBuySharesForm extends Component {
  componentDidMount() {
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

  // redux-form validate field function. Return undefined if it is ok or a string with an error.
  validateInvestment = (value = '') => {
    const investmentValue = value.trim()
    const { currentBalance = 0, collateralTokenBalance, collateralTokenSymbol } = this.props

    // check if investment is not undefined and test it against number regexp to prevent errors from decimal.js
    if (!investmentValue) {
      return 'Enter the investment value'
    }

    const validInvestment = NUMBER_REGEXP.test(investmentValue)
    if (!validInvestment) {
      return 'Invalid amount'
    }

    const decimalValue = Decimal(investmentValue)
    if (decimalValue.lte(0)) {
      return "Number can't be negative or equal to zero."
    }

    let balance = currentBalance

    if (!/^(WETH|ETH|W-ETH)$/.test(collateralTokenSymbol)) {
      balance = collateralTokenBalance.div(1e18)
    } else {
      balance = Decimal(balance).add(collateralTokenBalance.div(1e18))
    }

    if (decimalValue.gt(balance)) {
      return "You're trying to invest more than you have."
    }

    return undefined
  }

  @autobind
  handleBuyShares() {
    const {
      market,
      buyShares,
      selectedBuyInvest,
      reset,
      defaultAccount,
      selectedOutcome,
      limitMargin,
      fetchMarketTrades,
      fetchMarketTradesForAccount,
      fetchMarketShares,
    } = this.props

    const outcomeTokenCount = getOutcomeTokenCount(market, selectedBuyInvest, selectedOutcome, limitMargin)

    return buyShares(market, selectedOutcome, outcomeTokenCount, selectedBuyInvest)
      .then(() => {
        // Fetch new trades
        fetchMarketTrades(market)
        // Fetch new market participant trades
        fetchMarketTradesForAccount(defaultAccount)
        // Fetch new shares
        fetchMarketShares(defaultAccount)
        return reset()
      })
      .catch(e => console.error(e))
  }

  render() {
    const {
      gasCosts,
      gasPrice,
      isGasCostFetched,
      isGasPriceFetched,
      invalid,
      handleSubmit,
      market: { type, collateralToken },
      selectedBuyInvest,
      submitFailed,
      submitting,
      limitMargin,
      selectedOutcome,
      market,
      valid,
    } = this.props
    const investmentAmount = selectedBuyInvest.trim()
    const isValid = this.validateInvestment(investmentAmount) === undefined
      && valid
      && !!investmentAmount
      && typeof investmentAmount !== 'undefined'
    const gasCostEstimation = weiToEth(gasPrice.mul(gasCosts.get('buyShares') || 0))
    const submitDisabled = invalid || !investmentAmount || !selectedOutcome

    let outcomeTokenCount = 0
    let maximumWin = 0
    let percentageWin = 0

    if (isValid) {
      outcomeTokenCount = getOutcomeTokenCount(market, investmentAmount, selectedOutcome, limitMargin)
      maximumWin = getMaximumWin(outcomeTokenCount, investmentAmount)
      percentageWin = getPercentageWin(outcomeTokenCount, investmentAmount)
    }

    let fieldError
    let tokenCountField
    let maxReturnField

    if (!isValid) {
      fieldError = (
        <span className={cx('invalidParam')}>
--
        </span>
      )
    } else {
      const colorSource = type === OUTCOME_TYPES.CATEGORICAL ? COLOR_SCHEME_DEFAULT : COLOR_SCHEME_SCALAR
      const outcomeColorStyles = {
        backgroundColor: colorSource[selectedOutcome],
      }

      tokenCountField = (
        <span className={cx('marketBuyWin', 'winInfoRow', 'max')}>
          <DecimalValue value={weiToEth(outcomeTokenCount)} />
          &nbsp;
          <div className={cx('marketBuyWin', 'outcomeColor')} style={outcomeColorStyles} />
          &nbsp;
        </span>
      )

      const returnSign = maximumWin > 0 ? '+' : ''
      maxReturnField = (
        <span className={cx('marketBuyWin', 'winInfoRow', 'max')}>
          {returnSign}
          <DecimalValue value={percentageWin} />
          {' '}
%&nbsp; (
          <DecimalValue value={maximumWin} />
          &nbsp;
          <CurrencyName tokenAddress={collateralToken} />
          )
        </span>
      )
    }

    return (
      <div className={cx('marketBuySharesForm')}>
        <form onSubmit={handleSubmit(this.handleBuyShares)}>
          <div className={cx('row')}>
            <OutcomeSection
              market={market}
              valid={!!isValid}
              selectedBuyInvest={investmentAmount}
              selectedOutcome={selectedOutcome}
              outcomeTokenCount={outcomeTokenCount}
            />
            <div className={cx('col-md-5')}>
              <div className={cx('row', 'infoRow')}>
                <div className={cx('col-md-12')}>
                  <Field
                    name="invest"
                    component={TextInput}
                    className={cx('marketBuyInvest')}
                    decoration="underlined"
                    placeholder="Investment"
                    validate={this.validateInvestment}
                    endAdornment={(
                      <TextInputAdornment>
                        <CurrencyName tokenAddress={collateralToken} />
                      </TextInputAdornment>
                    )}
                  />
                </div>
              </div>
              <div className={cx('row', 'infoRow')}>
                <div className={cx('col-md-6')}>
Token Count
                </div>
                <div className={cx('col-md-6')}>
                  {fieldError || tokenCountField}
                </div>
              </div>
              <div className={cx('row', 'infoRow')}>
                <div className={cx('col-md-6')}>
Maximum return
                </div>
                <div className={cx('col-md-6')}>
                  {fieldError || maxReturnField}
                </div>
              </div>
              <div className={cx('row', 'infoRow')}>
                <div className={cx('col-md-6')}>
Gas Costs
                </div>
                <div className={cx('col-md-6')}>
                  {isGasPriceFetched && isGasCostFetched(GAS_COST.BUY_SHARES) ? (
                    <React.Fragment>
                      <DecimalValue value={gasCostEstimation} decimals={4} />
                      {' '}
ETH
                    </React.Fragment>
                  ) : (
                    <IndefiniteSpinner width={16} height={16} />
                  )}
                </div>
              </div>
              <LimitMarginAnnotation />
              {submitFailed && <SubmitError />}
              <div className={cx('row', 'infoRow')}>
                <div className={cx('col-xs-10', 'col-xs-offset-1')}>
                  <InteractionButton
                    className={cx('btn', 'btn-primary', 'col-xs-12')}
                    disabled={submitDisabled}
                    loading={submitting}
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
  market: marketShape.isRequired,
  buyShares: PropTypes.func.isRequired,
  marketShares: PropTypes.objectOf(marketShareShape),
  selectedOutcome: PropTypes.string,
  selectedBuyInvest: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  handleSubmit: PropTypes.func.isRequired,
  submitEnabled: PropTypes.bool,
  currentBalance: PropTypes.string.isRequired,
  collateralToken: PropTypes.shape({
    address: PropTypes.string,
    balance: PropTypes.string,
    icon: PropTypes.string,
    source: PropTypes.string,
    symbol: PropTypes.string,
  }),
}

MarketBuySharesForm.defaultProps = {
  marketShares: [],
  selectedOutcome: undefined,
  selectedBuyInvest: '',
  submitEnabled: false,
  collateralToken: {},
}

const form = {
  form: 'marketBuyShares',
}

export default reduxForm(form)(MarketBuySharesForm)

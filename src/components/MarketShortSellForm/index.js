import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import Decimal from 'decimal.js'
import autobind from 'autobind-decorator'

import { calcLMSRProfit } from 'api'

import { COLOR_SCHEME_DEFAULT, OUTCOME_TYPES } from 'utils/constants'


import DecimalValue from 'components/DecimalValue'
import CurrencyName from 'components/CurrencyName'

import FormRadioButton from 'components/FormRadioButton'
import Input from 'components/FormInput'
import Checkbox from 'components/FormCheckbox'

import './marketShortSellForm.less'
import '../MarketBuySharesForm/marketBuySharesForm.less'

class MarketShortSellForm extends Component {

  getMaximumReturn(collateralTokenCount, profit) {    
    if (collateralTokenCount !== undefined && profit !== undefined 
        && new Decimal(collateralTokenCount).gte(0) && new Decimal(profit).gte(0)) {      
      
      collateralTokenCount = new Decimal(collateralTokenCount).mul(1e18)
      return collateralTokenCount.div(collateralTokenCount.sub(profit))
    }
    return new Decimal(0)
  }

  getMaximumReturnPercentage(collateralTokenProfit, collateralTokenInvest) {  
    if (collateralTokenProfit !== undefined && collateralTokenInvest !== undefined 
        && new Decimal(collateralTokenProfit).gte(0) && new Decimal(collateralTokenInvest).gte(0)) {
      return (collateralTokenProfit.div(new Decimal(collateralTokenInvest).mul(1e18)).mul(100))     
    } 
    return new Decimal(0)   
  }  

  getMinProfit(market, outcomeTokenIndex, collateralTokenCount) {
    // Ratio outcomeTokenIndex : collateralTokenCount is always 1:1
    if (outcomeTokenIndex !== undefined && collateralTokenCount !== undefined 
        && new Decimal(outcomeTokenIndex).gte(0) && new Decimal(collateralTokenCount).gte(0)) {            

      const args = {
        'netOutcomeTokensSold': market.netOutcomeTokensSold,
        'funding': market.funding,
        'outcomeTokenIndex': outcomeTokenIndex,
        'outcomeTokenCount': new Decimal(collateralTokenCount).mul(1e18),
        'feeFactor': market.fee
      }

      // Calculate minimum profit      
      const minProfit = calcLMSRProfit(args)
      return minProfit
    }

    return new Decimal(0)
  }

  @autobind
  handleShortSell() {
    /*
    calc outcome tokens and min profit from ether value.
    1 ETH(collateral token) = 1 shares of outcome1, outcome2, outcome3
    1 ETH => 1 outcome token count
    1 ETH => min profit = https://github.com/gnosis/gnosis.js/blob/master/src/lmsr.js#L62

    Deposit ether value
    approve market to use ether value amount of collateral token
    Short sell selected outcome
    */
    event.preventDefault
    const { market: { eventDescription } } = this.props
    const outcomeIndex = event.target.value    
    const outcome = eventDescription.outcomes[outcomeIndex]      
  }

  renderOutcomes() {
    const { market: { event } } = this.props

    if (event.type === OUTCOME_TYPES.CATEGORICAL) {
      return this.renderCategorical()
    }

    return (
      <div className="col-md-4">
        <span>Invalid Outcomes...</span>
      </div>
    )
  }

  renderCategorical() {
    const { market: { eventDescription } } = this.props
    
    return (
      <div className="col-md-4">
        <div className="row">
          <div className="col-md-12">
            <h2 className="marketBuyHeading">SELECT  OUTCOME</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {eventDescription.outcomes.map((label, index) => (
              <Field
                key={index}
                component={FormRadioButton}
                name="selectedOutcome"
                highlightColor={COLOR_SCHEME_DEFAULT[index]}
                className="marketBuyOutcome"
                radioValue={index}
                text={label}                
              />
            ))}
          </div>
        </div>
      </div>
    )
  }  

  render() {
    const {
      handleSubmit,      
      selectedShortSellAmount,
      selectedShortSellOutcome,      
      market: {        
        event: {
          type: eventType,
          collateralToken,
        },
        ...market,
      },      
    } = this.props    
        
    const minProfit = this.getMinProfit(market, selectedShortSellOutcome, selectedShortSellAmount)    
    const maximumReturn = this.getMaximumReturn(selectedShortSellAmount, minProfit)    

    return (
      <div className="marketBuySharesForm">
        <form onSubmit={handleSubmit(this.handleShortSell)}>
          <div className="row">
            {this.renderOutcomes()}
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <h2 className="marketBuyHeading">YOUR BET</h2>
                </div>
              </div>
              <div className="row marketShortSellForm__row">
                <div className="col-md-8">
                  <Field name="shortSellAmount" component={Input} className="marketSellAmount" 
                    placeholder="Enter amount" />
                </div>
                <div className="col-md-4">
                  <div className="marketBuyCurrency">
                    <CurrencyName collateralToken={collateralToken} />
                  </div>
                </div>
              </div>
              <div className="row marketShortSellForm__row">
                <div className="col-md-6">
                    Maximum Win
                  </div>
                <div className="col-md-6">
                  <span className="marketBuyWin__row marketBuyWin__max">                    
                    <DecimalValue value={maximumReturn} /> %                    
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="row">
                <div className="col-md-12">
                  <h2 className="marketBuyHeading">CHECKOUT</h2>
                </div>
              </div>
              <div className="row marketShortSellForm__row">
                <div className="col-md-12">
                  <Field name="confirm" component={Checkbox} className="marketBuyCheckbox" 
                    text="I AGREE AND UNDERSTAND THAT ETH WILL BE TRANSFERRED FROM MY ACCOUNT" />
                </div>
              </div>
              <div className="row marketShortSellForm__row">
                <div className="col-md-6">
                  <button className="btn btn-primary">PLACE ORDER</button>
                </div>
                <div className="col-md-6">
                  <button className="btn btn-default col-md-12 marketShortSell__cancel">DISCARD</button>
                </div>
              </div>                                
            </div>
          </div>
        </form>
      </div>
    )
  }  

}

MarketShortSellForm.propTypes = {
  market: PropTypes.shape({
    address: PropTypes.string,
  }),
  invalid: PropTypes.bool,
  marketShares: PropTypes.arrayOf(PropTypes.object),
  shortSellAmount: PropTypes.string,
  selectedOutcome: PropTypes.string
}

const FORM = {
  form: 'marketShortSell',
}

export default reduxForm(FORM)(MarketShortSellForm)

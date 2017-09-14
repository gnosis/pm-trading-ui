import React, { Component, PropTypes } from 'react'
import { Field, reduxForm, propTypes } from 'redux-form'

import '../MarketBuySharesForm/marketBuySharesForm.less'

class MarketWithdrawFeesForm extends Component {

  render() {
    return (<div><h2>TODO</h2></div>)
  }
}

MarketWithdrawFeesForm.propTypes = {
  ...propTypes,
}

const form = {
  form: 'marketWithdrawFees',
}

export default reduxForm(form)(MarketWithdrawFeesForm)

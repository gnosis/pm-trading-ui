import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'

import MarketCreateWizard from 'components/MarketCreateWizard'

import { createMarket } from 'actions/market'

const FORM = {
  form: 'marketCreateWizard',
}

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector('marketCreateWizard')
  return {
    selectedOracleType: selector(state, 'oracleType'),
    selectedOutcomeType: selector(state, 'outcomeType'),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createMarket: market => dispatch(createMarket(market))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(FORM)(MarketCreateWizard))

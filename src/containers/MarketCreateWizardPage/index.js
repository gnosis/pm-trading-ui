import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'

import MarketCreateWizard from 'components/MarketCreateWizard'

import { composeMarket } from 'actions/gnosis'

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
    createMarket: market => dispatch(composeMarket(market))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(FORM)(MarketCreateWizard))

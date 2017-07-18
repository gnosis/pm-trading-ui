import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'

import MarketCreateReview from 'components/MarketCreateReview'

import { composeMarket } from 'actions/market'

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

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(FORM)(MarketCreateReview))

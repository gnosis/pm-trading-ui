import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'

import MarketCreateWizard from 'components/MarketCreateWizard'

const FORM = {
  form: 'marketCreateWizard',
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('marketCreateWizard')
  return {
    selectedOracleType: selector(state, 'oracleType'),
    selectedOutcomeType: selector(state, 'outcomeType'),
  }
}

export default connect(mapStateToProps)(reduxForm(FORM)(MarketCreateWizard))

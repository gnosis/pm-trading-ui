import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'
import { push } from 'react-router-redux'

import { getDefaultAccount } from 'selectors/blockchain'

import MarketCreateWizard from 'components/MarketCreateWizard'

const FORM = {
  form: 'marketCreateWizard',
  destroyOnUnmount: false,
  initialValues: {
    oracleType: 'CENTRALIZED',
    fee: '0',
    collateralToken: 'eth',
  },
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('marketCreateWizard')
  return {
    selectedOracleType: selector(state, 'oracleType'),
    selectedOutcomeType: selector(state, 'outcomeType'),
    defaultAccount: getDefaultAccount(state),
  }
}

const mapDispatchToProps = dispatch => ({
  changeUrl: url => dispatch(push(url)),
})

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(FORM)(MarketCreateWizard))

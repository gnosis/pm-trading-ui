import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import LegalComplianceForm from './components/Form'

import selectors from './store/selectors'

const form = {
  form: 'legalCompliance',
}

export default reduxForm(form)(connect(selectors)(LegalComplianceForm))

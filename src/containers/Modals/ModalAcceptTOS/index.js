import AcceptTOS from 'components/ModalContent/AcceptTOS'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { initProviders, setTermsAndConditionsStatus } from 'integrations/store/actions'

const mapStateToProps = (state) => {
  const getFormValue = formValueSelector('tosAgreement')

  return {
    tosAgreed: !!getFormValue(state, 'agreedWithTOS'),
    ppAgreed: !!getFormValue(state, 'agreedWithPP'),
    rdAgreed: !!getFormValue(state, 'agreedWithRDP'),
  }
}

const mapDispatchToProps = {
  initProviders,
  setTermsAndConditionsStatus,
}

export default connect(mapStateToProps, mapDispatchToProps)(AcceptTOS)

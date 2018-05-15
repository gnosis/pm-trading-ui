import AcceptTOS from 'components/ModalContent/AcceptTOS'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { initProviders } from 'integrations/store/actions'

const mapStateToProps = (state) => {
  const getFormValue = formValueSelector('tosAgreement')

  return {
    tosAgreed: !!getFormValue(state, 'agreedWithTOS'),
    ppAgreed: !!getFormValue(state, 'agreedWithPP'),
    rdAgreed: !!getFormValue(state, 'agreedWithRDP'),
  }
}

const mapDispatchToProps = dispatch => ({
  initProviders: () => dispatch(initProviders()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AcceptTOS)

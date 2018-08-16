import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { compose, withState } from 'recompose'

import actions from './store/actions'
import selectors from './store/selectors'

import OnFido from '../components'

const enhancer = compose(
  withState('step', 'setStep', { page: 'welcome', options: {} }),
  reduxForm({
    form: 'VERIFICATION_ONFIDO',
    onSubmit: (fields) => {
      let failure = false

      Object.keys(fields).forEach((fieldName) => {
        if (fields[fieldName].trim().length == 0) {
          failure = true
        }
      })

      return failure
    },
    onSubmitSuccess: (_, __, props) => {
      const { setStep, values } = props
      setStep({ page: 'integration', options: values })
    },
  }),
  connect(selectors, actions),
)

export default enhancer(OnFido)

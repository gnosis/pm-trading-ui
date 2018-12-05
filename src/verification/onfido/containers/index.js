import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { withNamespaces } from 'react-i18next'
import { compose, withState } from 'recompose'

import actions from './store/actions'
import selectors from './store/selectors'

import OnFido from '../components'

const handleCreateVerification = async (result, dispatch, props) => {
  const {
    setStep,
    values,
    values: { firstName, lastName, email },
    promptSignMessage,
    createUserVerification,
    updateUserVerification,
    account,
    t,
  } = props

  // might only needed to accept docs, check if verification was successful already
  let applicantStatus
  try {
    applicantStatus = await updateUserVerification(account)
  } catch (err) {
    return setStep({ page: 'denied', reason: err.message })
  }

  if (applicantStatus === 'ACCEPTED') {
    return props.closeModal()
  }

  if (applicantStatus === 'DENIED') {
    // TOS accepted or not required and application denied
    return setStep({
      page: 'denied',
      reason: t('verification.reasons.application_denied'),
    })
  }

  // request signature of a specified message or show denied screen with information about signing messages
  await setStep({ page: 'signMessage' })
  let signature
  try {
    signature = await promptSignMessage(
      `I hereby prove that I, ${firstName} ${lastName}, own the account "${account}" with this E-Mail Address "${email}"`,
    )
  } catch (err) {
    console.error(err)
    return setStep({
      page: 'denied',
      reason: t('verification.reasons.signature_failed'),
    })
  }

  // start verification or show error message in "denied" modal
  try {
    const { token } = await createUserVerification(firstName, lastName, email, signature, account)

    await setStep({ page: 'integration', options: { signature, ...values, token } })
  } catch (err) {
    await setStep({ page: 'denied', reason: err.message })
  }

  return undefined
}

const enhancer = compose(
  withState('step', 'setStep', { page: 'loading', options: {} }),
  connect(
    selectors,
    actions,
  ),
  reduxForm({
    form: 'VERIFICATION_ONFIDO',
    onSubmit: (fields) => {
      let failure = false

      Object.keys(fields).forEach((fieldName) => {
        if (fields[fieldName].trim().length === 0) {
          failure = true
        }
      })

      return failure
    },
    onSubmitSuccess: async (result, dispatch, props) => {
      try {
        await handleCreateVerification(result, dispatch, props)
      } catch (err) {
        console.warn(err)
      }
    },
  }),
  withNamespaces(),
)

export default enhancer(OnFido)

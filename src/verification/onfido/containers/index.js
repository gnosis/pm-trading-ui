import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { compose, withState, lifecycle } from 'recompose'

import actions from './store/actions'
import selectors from './store/selectors'

import OnFido from '../components'

const handleCreateVerification = async (result, dispatch, props) => {
  const {
    setStep,
    values,
    values: {
      firstName,
      lastName,
      email,
    },
    promptSignMessage,
    createUserVerification,
    updateUserVerification,
    account,
  } = props

  // might only needed to accept docs, check if verification was successful already
  const applicantStatus = await updateUserVerification(account)

  if (applicantStatus === 'ACCEPTED') {
    return props.closeModal()
  }

  if (applicantStatus === 'DENIED') {
    // TOS accepted or not required and application denied
    await setStep({ page: 'denied', reason: 'Unfortunately, you didn’t pass the verification process. Please get in contact with OnFido.com for further information.' })
  }

  // request signature of a specified message or show denied screen with information about signing messages
  await setStep({ page: 'signMessage' })
  let signature
  try {
    signature = await promptSignMessage(`I hereby prove that I, ${firstName} ${lastName}, own the account "${account}" with this E-Mail Address "${email}"`)
  } catch (err) {
    console.error(err)
    return setStep({ page: 'denied', reason: 'Your Message Signature was rejected. Please try again, and make sure you\'re using the latest version of your wallet-provider.' })
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
  connect(selectors, actions),
  lifecycle({
    async componentDidMount() {
      const {
        updateUserVerification,
        setStep,
        account,
        tosAccepted,
      } = this.props

      const applicantStatus = await updateUserVerification(account)
      if (tosAccepted) {
        if (applicantStatus === 'PENDING_DOCUMENT_UPLOAD') {
          // TOS accepted or not required and process started but not finished - need to restart in order to get a new token
          return setStep({
            page: 'denied',
            heading: 'Your Application was not completed',
            reason: 'It seems your previous verification did not complete. Please try again.',
          })
        }
        if (applicantStatus === 'WAITING_FOR_APPROVAL') {
          return setStep({
            page: 'denied',
            heading: 'Your Application is pending with our Verification Service',
            reason: 'Please try again later. Check your E-Mails to continue with the verification process if you have not done so. Additionally, if you didn\'t receive an E-Mail, you can retry the verification below.',
          })
        }
        if (applicantStatus === 'DENIED') {
          // TOS accepted or not required and application denied
          return setStep({
            page: 'denied',
            reason: 'Unfortunately, you didn’t pass the verification process. Please get in contact with OnFido.com for further information.',
          })
        }
        if (applicantStatus === 'ACCEPTED') {
          // TOS accepted and application accepted - should be able to connect now
          // updateUserVerification will set the state entry about a finished verification if it wasnt set before.
          return this.props.closeModal()
        }
      }

      // TOS not accepted but required, wait until signature and message signature to let the user know if their application was denied or accepted.
      return setStep({
        page: 'welcome',
      })
    },
  }),
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
)

export default enhancer(OnFido)

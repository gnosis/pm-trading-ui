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
  const isVerified = await updateUserVerification(account)

  if (isVerified) {
    return props.closeModal()
  }

  // Request Signature of a specified message that can be proofchecked that it belongs to the user
  await setStep({ page: 'signMessage' })
  const signature = await promptSignMessage(`I hereby proof that I, ${firstName} ${lastName}, own the account "${account}" with this E-Mail Address "${email}"`)

  try {
    const { token } = await createUserVerification(firstName, lastName, email, signature, account)
    await setStep({ page: 'integration', options: { signature, ...values, token } })
  } catch (err) {
    await setStep({ page: 'denied', reason: err.message })
  }
}

const enhancer = compose(
  withState('step', 'setStep', { page: 'loading', options: {} }),
  connect(selectors, actions),
  lifecycle({
    async componentDidMount() {
      const { updateUserVerification, setStep, account } = this.props
      const isVerified = await updateUserVerification(account)

      if (isVerified) {
        return this.props.closeModal()
      }

      return setStep({ page: 'welcome', options: {} })
    },
  }),
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

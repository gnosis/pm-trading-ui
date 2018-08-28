import React from 'react'
import PropTypes from 'prop-types'
import Indefinite from 'components/Spinner/Indefinite'

import Welcome from './Welcome'
import OnFidoIntegration from './OnFidoIntegration'

const SignMessage = () => (
  <p>Please sign the Metamask message in order to continue the verification process.</p>
)

const Steps = {
  welcome: Welcome,
  integration: OnFidoIntegration,
  signMessage: SignMessage,
}

const OnFido = ({ step, ...props }) => {
  const { page, options } = step

  if (Steps[page]) {
    const StepComponent = Steps[page]
    return <StepComponent {...props} {...options} />
  }

  return <Indefinite width={64} height={64} />
}

OnFido.propTypes = {
  step: PropTypes.shape({
    page: PropTypes.string.isRequired,
    options: PropTypes.object,
  }).isRequired,
}

export default OnFido

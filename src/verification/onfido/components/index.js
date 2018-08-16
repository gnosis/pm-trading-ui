import React from 'react'
import Indefinite from 'components/Spinner/Indefinite'

import Welcome from './Welcome'
import OnFidoIntegration from './OnFidoIntegration'

const Steps = {
  welcome: Welcome,
  integration: OnFidoIntegration,
}

const OnFido = ({ step, ...props }) => {
  const { page, options } = step
  if (Steps[page]) {
    const StepComponent = Steps[page]
    return <StepComponent {...props} {...options} />
  }

  return <Indefinite width={64} height={64} />
}

export default OnFido

import React from 'react'
import PropTypes from 'prop-types'
import { getFeatureConfig, isFeatureEnabled } from 'utils/features'

// verification integrations
import onfido from './onfido'

const verificationEnabled = isFeatureEnabled('verification')
const verificationHandlers = {
  onfido,
}

class VerificationHandler extends React.Component {
  constructor(props) {
    super(props)

    this.enabled = verificationEnabled
    this.verificator = undefined

    const {
      handler,
      config,
    } = getFeatureConfig('verification')

    if (verificationEnabled && typeof verificationHandlers[handler] !== 'undefined') {
      this.verificator = verificationHandlers[handler]
      try {
        this.verificator.initialize(config)
      } catch (err) {
        console.warn(`Verification could not be enabled: "${err}"`)
      }
    }
  }

  render() {
    const VerificationComponent = this.verificator?.DisplayComponent

    if (!VerificationComponent) {
      const { errorComponent: ErrorComponent } = this.props
      return <ErrorComponent />
    }

    return (
      <VerificationComponent />
    )
  }
}

VerificationHandler.propTypes = {
  errorComponent: PropTypes.func,
}

VerificationHandler.defaultProps = {
  errorComponent: React.createElement('span'),
}

export default VerificationHandler

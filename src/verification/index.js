import React from 'react'
import PropTypes from 'prop-types'
import { getFeatureConfig, isFeatureEnabled } from 'utils/features'

// verification integrations
import onfido from './onfido'

const verificationEnabled = isFeatureEnabled('verification')
const verificationComponents = {
  onfido,
}

const {
  handler,
  config,
} = getFeatureConfig('verification')

class VerificationHandler extends React.Component {
  constructor(props) {
    super(props)

    this.enabled = verificationEnabled
    this.verificator = undefined

    if (verificationEnabled) {
      if (typeof verificationComponents[handler] !== 'undefined') {
        this.VerificationComponent = verificationComponents[handler]
      } else {
        console.warn(`unknown verification ${handler}`)
      }
    }
  }

  render() {
    if (!this.VerificationComponent) {
      const { errorComponent: ErrorComponent } = this.props
      return <ErrorComponent />
    }

    return (
      <this.VerificationComponent {...config} />
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
